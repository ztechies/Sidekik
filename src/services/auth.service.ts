import { GoogleUser, LoginUser, ResetPassword, UpdateUserSchema, User as UserType } from "../@types/user.types"
import User from "../models/User"
import bcrypt from 'bcryptjs';
import { CustomError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken"
import { config } from "../config/config";
import { generateToken, sendEmail } from "../utils/helper";
import mongoose from "mongoose";
import generateRandomNumber from "../utils/generateRandomNumber";

const fromEmail = config.sendGrid.emailFrom;

const verifyToken = async (token: string) => {
    const response = jwt.verify(token, config.jwt.secretKey)
    const { user_id }: any = response;
    const user = await User.findOne({ _id: user_id }).select('_id firstName lastName userName email role');

    if (!user) {
        throw new CustomError('Verification token is invalid or has expired.', 400);
    }
    return user;
};

const sendOTPEmail = async (email: string, name: string, otp: number | undefined) => {
    try {
        const message = {
            to: email,
            from: {
                name: "Sidekik",
                email: fromEmail,
            },
            templateId: "d-8903ff1c24b54cdfb5ed2082fd4e5235",
            dynamicTemplateData: {
                name,
                otp: otp
            },
        };

        const response = await sendEmail(message);
        if (response) {
            return response
        }
    } catch (error) {
        throw error
    }
};

const sendVerificationEmail = async (email: string, userName: string, token: string | undefined) => {
    try {
        const message = {
            to: email,
            from: {
                name: "Sidekik",
                email: fromEmail,
            },
            templateId: "d-02b997bd436048e9b0ae1c87d3b033c0",
            dynamicTemplateData: {
                userName,
                year: new Date().getFullYear(),
                verificationUrl: `${config.frontEndUrl.url}/verify-email/${token}`
            },
        };

        const response = await sendEmail(message);
        if (response) {
            return response
        }
    } catch (error) {
        throw error
    }
};


const sendResetPasswordEmail = async (email: string, fname: string, lname: string) => {
    try {
        const message = {
            to: email,
            from: {
                name: "Sidekik",
                email: fromEmail,
            },
            templateId: "d-6c8ccfe321b94d11889d83c427811ca4",
            dynamicTemplateData: {
                fname,
                lname
            },
        };

        const response = await sendEmail(message);
        if (response) {
            return response
        }
    } catch (error) {
        throw error
    }
};

const registerUser = async (user: { email: string, password: string, userName: string }) => {
    const sixDigitNumber = generateRandomNumber(6);
    const fourDigitNumber = generateRandomNumber(4);
    let session;

    try {
        const { email, password, userName } = user;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError("User already exists", 400);
        }

        session = await mongoose.startSession();
        session.startTransaction();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({
            ...user,
            userName: userName + fourDigitNumber,
            otp: sixDigitNumber,
            otpExpiry: new Date(Date.now() + 10 * 60000),
            password: hashedPassword
        });

        const savedUser = await newUser.save({ session: session });

        if (!savedUser) {
            throw new CustomError("Failed to save user", 500);
        }

        const response = await sendOTPEmail(email, newUser.firstName, sixDigitNumber);

        if (!response) {
            await session.abortTransaction();
            session.endSession();
            throw new CustomError("Failed to send verification email", 500);
        }

        await session.commitTransaction();
        session.endSession();

        return savedUser._id

    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        throw error;
    }
};



const verifyEmail = async (verificationToken: string) => {
    const response = jwt.verify(verificationToken, config.jwt.secretKey)

    const { user_id }: any = response;
    const user = await User.findOneAndUpdate({ _id: user_id }, { emailVerify: true });
    const token = await generateToken({ user_id: user?._id, role: user?.role }, '24h')

    if (!user || !response) {
        throw new CustomError('Verification token is invalid or has expired.', 400);
    }
    return ({ message: 'Email Verified Successfully', token: token })
};

const registerGoogleUser = async (user: GoogleUser) => {
    try {
        const { email } = user;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError("User already exists", 400);
        }

        const newUser = new User({ ...user, emailVerify: true });
        const savedUser = await newUser.save();

        if (savedUser) {
            const jwtToken = await generateToken({ user_id: savedUser._id, role: savedUser.role }, '24h');
            return jwtToken;
        }
    } catch (error) {
        throw error;
    }
};

const loginUser = async (loginData: LoginUser) => {
    try {
        const sixDigitNumber = generateRandomNumber(6);
        const userDataFromDB = await User.findOne({ email: loginData.email });
        if (userDataFromDB != null && userDataFromDB.password != null && loginData.role === userDataFromDB.role && userDataFromDB.registrationType === "form" && userDataFromDB.emailVerify === true) {
            const flag = await bcrypt.compare(loginData.password, userDataFromDB.password);
            if (flag) {
                let jwtToken = await generateToken({ user_id: userDataFromDB._id, role: userDataFromDB.role }, '24h');
                return ({ jwtToken, emailVerify: userDataFromDB.emailVerify });
            } else {
                throw new CustomError("Password Not Match", 401);
            }
        } else if (userDataFromDB != null && userDataFromDB.password != null && userDataFromDB.emailVerify === false) {
            const flag = await bcrypt.compare(loginData.password, userDataFromDB.password);
            if (flag) {
                const { _id, email, firstName } = userDataFromDB;
                await User.findByIdAndUpdate(_id, { otp: sixDigitNumber, otpExpiry: new Date(Date.now() + 10 * 60000) })

                const response = await sendOTPEmail(email, firstName, sixDigitNumber);
                if (response) {
                    return ({ userId: userDataFromDB._id, emailVerify: false });
                }
            } else {
                throw new CustomError("Password Not Match", 401);
            }
        } else {
            throw new CustomError("User not Exist !", 400);
        }
    } catch (error) {
        throw error;
    }
};


const loginGoogleUser = async (loginData: LoginUser) => {

    try {
        const userDataFromDB = await User.findOne({ email: loginData.email })
        if (userDataFromDB != null && loginData.role === userDataFromDB?.role && userDataFromDB.registrationType === "google") {
            let jwtToken = await generateToken({ user_id: userDataFromDB._id, role: userDataFromDB.role }, '24h')
            return jwtToken;
        } else {
            throw new CustomError("User not Exist !", 400);
        }
    } catch (error) {
        throw error;
    }
}


const getUsers = async () => {
    try {
        return await User.find().select('_id firstName lastName email userName role');
    } catch (error) {
        throw error;
    }
};


const getUserById = async (userId: string) => {
    try {
        const user = await User.findById(userId).select('_id firstName lastName userName email role profileImage mobile');
        return (user);
    } catch (error) {
        throw error;
    }
};

const checkUserName = async (userName: string) => {
    try {
        let isUserName = await User.findOne({ userName });

        if (isUserName) {
            throw new CustomError("Username Already Exist", 404);
        }

        return ("Username Available")
    } catch (error) {
        throw error;
    }
}


const updateUser = async (user: UpdateUserSchema, id: string) => {
    try {
        const existingUser = await User.findById({ _id: id });
        if (!existingUser) {
            throw new CustomError("User does not exist", 400);
        }

        const updatedUser = await User.findByIdAndUpdate({ _id: id }, user, { new: true });

        if (updatedUser) {
            return 'User Updated Successfully';
        }
    } catch (error: any) {
        throw new Error(error);
    }
};

const forgotPassword = async (data: { token: string, newPassword: string }) => {

    const { token, newPassword } = data;
    let email: string;

    try {
        const decoded: any = jwt.verify(token, config.jwt.secretKey);
        email = decoded.email;
    } catch (error) {
        throw new CustomError("Token Verification Error", 401);
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new CustomError("User not found", 404);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    const updatedUser = await User.updateOne({ email }, user)
    return { message: "Password updated successfully", error: false };
}

const generateRecoverPasswordLink = async ({ email, role }: { email: string, role: string }) => {
    try {
        const user = await User.findOne({ email });

        if (!user || user.registrationType == "google" || user.role != role) {
            throw new CustomError("User not found", 404);
        }

        const jwtToken = await generateToken({ email, role: user.role }, '15m')
        const recoveryLink = `${config.frontEndUrl.url}/forget-password/${jwtToken}`;

        const message = {
            to: email,
            from: {
                name: "Sidekik",
                email: fromEmail,
            },
            templateId: "d-520c5501582943ef929d48d78501b988",
            dynamicTemplateData: {
                name: user?.userName,
                recoveryLink: recoveryLink
            },
        }

        const response = await sendEmail(message);

        if (response) {
            return { message: "success" }
        }

        return recoveryLink;
    } catch (error) {
        throw error;
    }
}

const resetPassword = async (data: ResetPassword) => {
    let session = null;
    try {
        const { userId, oldPassword, newPassword } = data;
        session = await mongoose.startSession();
        session.startTransaction();

        const userDataFromDB = await User.findById(userId).session(session);

        if (!userDataFromDB) {
            throw new CustomError("User not Exist!", 400);
        }

        if (userDataFromDB.registrationType !== "form" || !userDataFromDB.emailVerify) {
            throw new CustomError("User registration type or email verification is not valid", 400);
        }

        if (!userDataFromDB.password) {
            throw new CustomError("User password is not set", 500);
        }

        const compare = await bcrypt.compare(oldPassword, userDataFromDB.password);

        if (!compare) {
            throw new CustomError("Invalid Old Password", 401);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const update = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true }).session(session);

        if (!update) {
            throw new CustomError("Failed to update Password", 500);
        }

        if (!update.email || !update.firstName || !update.lastName) {
            throw new CustomError("User email, first name, or last name is not defined", 500);
        }

        const response = await sendResetPasswordEmail(update.email, update.firstName, update.lastName);

        if (!response) {
            await session.abortTransaction();
            session.endSession();
            throw new CustomError("Failed to send email", 500);
        }

        await session.commitTransaction();
        session.endSession();

        return "Password Updated Successfully";
    } catch (error) {
        console.log("err", error);

        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        throw error;
    }
};



export default { getUsers, registerUser, forgotPassword, generateRecoverPasswordLink, getUserById, updateUser, checkUserName, registerGoogleUser, loginUser, loginGoogleUser, verifyEmail, verifyToken, resetPassword } 