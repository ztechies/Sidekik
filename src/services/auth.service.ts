import { GoogleUser, LoginUser, User as UserType } from "../@types/user.types"
import User from "../models/User"
import bcrypt from 'bcryptjs';
import { CustomError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken"
import { config } from "../config/config";
import { generateToken, sendEmail } from "../utils/helper";
import mongoose from "mongoose";

const fromEmail = config.sendGrid.emailFrom;


const verifyToken = async (token: string) => {
    const response = jwt.verify(token, config.jwt.secretKey)

    const { user_id }: any = response;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
        throw new CustomError('Verification token is invalid or has expired.', 400);
    }
    return true;
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

const registerUser = async (user: { email: string, password: string }) => {
    let session; // Declare a session object for transaction

    try {
        const { email, password } = user;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new CustomError("User already exists", 400);
        }

        // Start a MongoDB transaction (if supported by your database)
        session = await mongoose.startSession();
        session.startTransaction();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            ...user,
            password: hashedPassword
        });

        const savedUser = await newUser.save({ session: session });

        if (!savedUser) {
            throw new CustomError("Failed to save user", 500);
        }

        let verificationToken = await generateToken({ user_id: savedUser._id }, '15m');
        const response = await sendVerificationEmail(email, newUser.userName, verificationToken);

        if (!response) {
            // Rollback transaction: delete the user
            await session.abortTransaction();
            session.endSession();
            throw new CustomError("Failed to send verification email", 500);
        }

        // Commit transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        return "User Registered Successfully";

    } catch (error) {
        if (session) {
            // If an error occurred, abort the transaction and end the session
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
    const token = await generateToken({ user_id: user?._id }, '24h')

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
            const response = await sendVerificationEmail(email, newUser.userName, undefined);

            if (response) {
                const jwtToken = await generateToken({ user_id: savedUser._id }, '24h');
                return jwtToken;
            }
        }
    } catch (error) {
        throw error;
    }
};

const loginUser = async (loginData: LoginUser) => {
    try {
        const userDataFromDB = await User.findOne({ email: loginData.email });
        if (userDataFromDB != null && userDataFromDB.password != null && loginData.role === userDataFromDB.role && userDataFromDB.registrationType === "form" && userDataFromDB.emailVerify === true) {
            const flag = await bcrypt.compare(loginData.password, userDataFromDB.password);
            if (flag) {
                let jwtToken = await generateToken({ user_id: userDataFromDB._id }, '24h');
                return ({ jwtToken, emailVerify: userDataFromDB.emailVerify });
            } else {
                throw new CustomError("Password Not Match", 401);
            }
        } else if (userDataFromDB != null && userDataFromDB.password != null && userDataFromDB.emailVerify === false) {
            const flag = await bcrypt.compare(loginData.password, userDataFromDB.password);
            if (flag) {
                let jwtToken = await generateToken({ user_id: userDataFromDB._id }, '24h');
                const { email, userName } = userDataFromDB;
                const response = await sendVerificationEmail(email, userName, jwtToken);
                if (response) {
                    return ({ jwtToken, emailVerify: false });
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
            let jwtToken = await generateToken({ user_id: userDataFromDB._id }, '24h')
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
        return await User.find();
    } catch (error) {
        throw error
    }
}

const getUserById = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        return (user);
    } catch (error) {
        throw error;
    }
};

const forgotPassword = async (data: any) => {

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

        const jwtToken = await generateToken({ email }, '15m')
        const recoveryLink = `${config.frontEndUrl.url}/reset-password/${jwtToken}`;

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

export default { getUsers, registerUser, forgotPassword, generateRecoverPasswordLink, getUserById, registerGoogleUser, loginUser, loginGoogleUser, verifyEmail, verifyToken } 