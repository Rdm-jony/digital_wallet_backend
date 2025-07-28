import { Types } from "mongoose";



export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    AGENT="AGENT"
}

export interface IAuthProvider{
    provider:"google" | "credentials",
    providerId:string
}

export interface IUser {
    _id?: Types.ObjectId,
    name: string,
    email: string,
    password?: string,
    phone?: string,
    address?: string,
    picture?: string,
    isDeleted?: boolean,
    isVerified?: boolean,
    isBlocked?: boolean,
    role:Role,
    auth:IAuthProvider[]

}