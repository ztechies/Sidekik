export type AddPolicy = {
    title: string,
    template: string,
    status : "active" | "inActive"
}

export type UpdatePolicy = {
    id: string,
    template?: string,
    status? : "active" | "inActive"

}