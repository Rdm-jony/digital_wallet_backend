import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import { boolean } from "zod";

export const authProvideSchema=new Schema<IAuthProvider>({
    provider:{type:String,required:true},
    providerId:{type:String,required:true}
},{
    versionKey:false,
    _id:false
})

const userSchema = new Schema<IUser>({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    address:{type:String},
    isActive:{type:String,enum:Object.values(IsActive),default:IsActive.ACTIVE},
    isDeleted:{type:boolean,default:false},
    isVerified:{type:boolean,default:false},
    phone:{type:String},
    picture:{type:String},
    role:{type:String,enum:Object.values(Role),default:Role.USER},
    auth:[authProvideSchema]
},{
    timestamps:true
})

export const User=model("User",userSchema)