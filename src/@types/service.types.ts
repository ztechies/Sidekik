export type AddService = {
    title: string,
    isVerified?: boolean
}

export type UpdateService = {
    id: string,
    title: string,
    isVerified?: boolean
    isDeleted?: boolean
}