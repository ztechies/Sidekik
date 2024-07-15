import { Role } from "./role.types"

export type User = {
    firstName: string,
    lastName: string,
    email: string,
    role: Role,
    password: string,
    registrationType: string
}

export type GoogleUser = {
    firstName: string,
    lastName: string,
    email: string,
    role: Role,
    registrationType: string,
    googleId: string,
    security: object
}

export type LoginUser = {
    email: string,
    password: string,
    role: string;
}
