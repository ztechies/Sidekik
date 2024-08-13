export interface AddUserPortfolio {
    profileId: string;
    materialType: 'Website' | 'Video' | 'Image' | 'Press Release' | 'Other';
    materialTypeName: string;
    customMaterialType?: string;
    files?: string[];
    links?: string[];
}

export interface UpdateUserPortfolio {
    id: string;
    profileId: string;
    materialType?: 'Website' | 'Video' | 'Image' | 'Press Release' | 'Other';
    materialTypeName?: string;
    customMaterialType?: string;
    files?: string[];
    links?: string[];
}