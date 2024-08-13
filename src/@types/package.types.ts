export type Milestone = {
    name: string;
    description: string;
    dueDate: Date;
    percentage: number;
    when: string;
    completed?: boolean;
    isDeleted?: boolean;
  };
  
export type AddPackage = {
    userId: string,
    title: string,
    subTitle: string,
    serviceId: string,
    packageType: "standard" | "custom",
    price: number,
    duration: string,
    popular: boolean,
    milestones?: Milestone[];
}


export type UpdatePackage = {
    id: string,
    userId: string,
    title: string,
    subTitle: string,
    serviceId: string,
    packageType: "standard" | "custom",
    price: number,
    duration: string,
    description: string,
    popular: boolean,
    milestones?: Milestone[];
}