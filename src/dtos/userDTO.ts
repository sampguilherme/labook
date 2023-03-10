import { UserModel } from "../types"

export interface GetUsersInput{
    q: unknown
}

export type GetUsersOutput = UserModel[]

export interface LoginInput {
    email: unknown,
    password: unknown
}

export interface LoginOutput {
    message: string,
    token: string
}

export interface SingnupInput {
    name: unknown,
    email: unknown,
    password: unknown
}

export interface SingnupOutput {
    message: string,
    token: string
}