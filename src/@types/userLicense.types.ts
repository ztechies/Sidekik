export type AddUserLicense = {
    title: string,
    template: string,
    status : "active" | "inActive"
}

export type UpdateUserLicense = {
    id: string,
    template?: string,
    status? : "active" | "inActive"

}