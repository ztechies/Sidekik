import User from "../models/User"
import Profile from "../models/Profile";
import userPortfolio from "../models/UserPortfolio";
import Packages from "../models/Packages";
import { CustomError } from "../middleware/errorHandler";


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
