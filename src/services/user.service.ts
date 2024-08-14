import User from "../models/User"
import Profile from "../models/Profile";
import userPortfolio from "../models/UserPortfolio";
import Packages from "../models/Packages";
import { CustomError } from "../middleware/errorHandler";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { generateToken, sendEmail } from "../utils/helper";
import { config } from "../config/config";
const fromEmail = config.sendGrid.emailFrom;


export const getProfileStatusById = async (user_id: string) => {
  const user = await User.findOne({ _id: user_id }).select('firstName lastName email mobile');
  if (!user) {
    throw new CustomError('User not found!', 400);
  }
  const profile = await Profile.findOne({ userId: user_id }).select('country city socialLinks languages clientCountries longIntro shortIntro');
  const portfolio = await userPortfolio.findOne({ userId: user_id });
  const packages = await Packages.findOne({ userId: user_id });

  const userKeysCount = user ? Object.keys(user.toObject()).length : 0;
  const profileKeysCount = profile ? Object.keys(profile.toObject()).length : 0;
  const portfolioKeysCount = portfolio ? Object.keys(portfolio.toObject()).length : 0;

  const stepOne = userKeysCount >= 5;
  const stepTwo = profileKeysCount >= 8;
  const stepFour = portfolioKeysCount >= 5;
  const stepFive = !!packages;

  const steps = { stepOne, stepTwo, stepFour, stepFive };
  const percent = Object.values(steps).filter(Boolean).length * 20;

  return { percent, steps };
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

export const updateUserOtp = async (userId: string, otp: number, otpExpiry: Date) => {
  try {
    console.log("in.");

    const user = await User.findOne({ _id: userId });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        otp: otp,
        otpExpiry: otpExpiry
      },
      {
        new: true,
        runValidators: true
      }
    );

    const response = await sendOTPEmail(user?.email, user?.firstName, otp);

    if (!updatedUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    } else {
      return updatedUser;
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error updating user");
  }
}

export const verifyUserOtp = async (userId: string, otp: string) => {
  try {
    const user: any = await User.findById(userId);
    if (!user) {
      return false;
    }

    if (user.otp !== otp) {
      return false;
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      return false;
    }
    await User.findOneAndUpdate({ _id: userId }, { emailVerify: true });
    const token = await generateToken({ user_id: user?._id, role: user?.role }, '24h')
    console.log(userId, otp, user.otp, "asdasdasdasdsd")
    console.log(token, "token")

    return token;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};
