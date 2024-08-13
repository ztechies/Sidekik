interface Business {
    businessName?: string;
    countryOfIncorporation?: string;
    registrationNumber?: string;
    address?: string;
}

interface SocialLink {
    platform: 'Facebook' | 'Twitter' | 'Instagram' | 'LinkedIn' | 'Other';
    url: string;
}

export interface AddProfileSchema {
    userId: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    mobile: string;
    country?: string;
    city?: string;
    languages?: string[];
    socialLinks?: SocialLink[];
}

export interface UpdateProfileSchema {
    userId?: string;
    country?: string;
    state?: string;
    city?: string;
    languages?: string[];
    business?: Business;
    socialLinks?: SocialLink[];
    shortIntro?: string;
    longIntro?: string;
    usePlatformAs?: ['business', 'individual'] | any,
    primaryService?: string[];
    otherService?: string[];
    clientCountries?: string[];
}

