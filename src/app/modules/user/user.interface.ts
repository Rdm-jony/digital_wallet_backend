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

export enum AgentStatus{
    NONE="NONE",
    PENDING="PENDING",
    APPROVED="APPROVED",
    SUSPENDED="SUSPENDED"
    
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
    agentRequest?:AgentStatus;
    role:Role,
    auth:IAuthProvider[]

}