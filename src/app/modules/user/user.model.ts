import { model, Schema } from "mongoose";
import { IAuthProvider, IUser, Role } from "./user.interface";

export const authProvideSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    picture: { type: String },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auth: [authProvideSchema]
}, {
    timestamps: true
})

export const User = model("User", userSchema)