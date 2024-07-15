export type AddSubscription = {
    title: string,
    duration: string,
    discount: number,
    promoCode: string,
    noOfProjects: number,
    dataSupport: string,
    status?: "active" | "inActive"
}

export type UpdateSubscription = {
    id: string,
    duration: string,
    discount: number,
    promoCode: string,
    noOfProjects: number,
    dataSupport: string,
    status?: "active" | "inActive"
}