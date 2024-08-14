import { Request, Response, NextFunction } from "express";
import profileService from "../services/profile.service";
import { getProfileStatusById } from "../services/user.service";
import authService from "../services/auth.service";

export const getAllProfiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profiles = await profileService.getAllProfiles();
        res.status(200).json({ profiles, error: false });
    } catch (err: unknown) {
        next(err);
    }
}

export const getProfileById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const profile = await profileService.getProfileById(id);
        res.status(200).json({ profile, error: false });
    } catch (err: unknown) {
        next(err);
    }
}

export const getProfileByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const profile = await profileService.getProfileByUserId(userId);
        res.status(200).json({ profile, error: false });
    } catch (err: unknown) {
        next(err);
    }
}

export const addProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await profileService.addProfile(req.body);
        res.status(200).json({ profile: response, error: false });
    } catch (error: unknown) {
        next(error);
    }
}

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const {
            profileImage,
            firstName,
            lastName,
            mobile,
            userName,
            primaryService,
            otherService,
            state,
            country,
            city,
            languages,
            usePlatformAs,
            business,
            socialLinks,
            shortIntro,
            longIntro,
            clientCountries
        } = req.body;

        const userData = {
            profileImage,
            firstName,
            lastName,
            mobile,
            userName
        }

        const profileData = {
            primaryService,
            otherService,
            country,
            state,
            city,
            languages,
            usePlatformAs,
            business,
            socialLinks,
            shortIntro,
            longIntro,
            clientCountries
        }

        if (profileImage || firstName || lastName || mobile || userName) {
            const response = await authService.updateUser(userData, userId)
        }

        if (primaryService || otherService || country || city || languages || usePlatformAs || business || socialLinks || shortIntro || longIntro || clientCountries) {
            const response = await profileService.updateProfile(profileData, userId)
        }

        const profileStatus = await getProfileStatusById(userId)
        res.status(200).json({ profile: { response: 'profile updated successfully', profileStatus }, error: false });
    } catch (error: unknown) {
        next(error);
    }
}


export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const response = await profileService.deleteProfile(id);
        res.status(200).json({ profile: response, error: false });
    } catch (error: unknown) {
        next(error);
    }
}
