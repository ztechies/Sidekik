export type AddTermsOfUse = {
    title: string,
    template: string,
    status : "active" | "inActive"
}

export type UpdateTermsOfUse = {
    id: string,
    template?: string,
    status? : "active" | "inActive"

}