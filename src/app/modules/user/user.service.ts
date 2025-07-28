import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatusCode from "http-status-codes"
import bcrypt from "bcryptjs"
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloudinary } from "../../config/cloudinary.config";

const createUser = async (payload: Partial<IUser>) => {
    const email = payload.email
    const isUserExists = await User.findOne({ email })
    if (isUserExists) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "user already exists!!")
    }
    const hashPassword = bcrypt.hashSync(payload.password as string, parseInt(envVars.BCRYPT_SALT))
    const authProvider: IAuthProvider = {
        provider: 'credentials',
        providerId: email as string
    }
    const user = await User.create({ ...payload, auth: [authProvider], password: hashPassword })
    const userObj = user.toObject();
    delete userObj.password;
     return userObj
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUserExists = await User.findById(userId)

    if (!isUserExists) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found")

    }

    if (decodedToken.role === Role.USER) {
        if (decodedToken.userId !== userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are unauthorized to update another users profile")
        }
    }
    if (decodedToken.role === Role.ADMIN && isUserExists.role == Role.SUPER_ADMIN) {
        if (decodedToken.userId !== userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized to update superadmin profile")
        }
    }

    if (payload.role) {
        if (decodedToken.role == Role.USER) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");

        }

        if (payload.role == Role.SUPER_ADMIN && decodedToken.role == Role.ADMIN) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
        }

    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER) {
            throw new AppError(httpStatusCode.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select("-password")
    if (isUserExists.picture) {
        await deleteImageFromCloudinary(isUserExists.picture)
    }
    return newUpdatedUser

}

const getAllUser = async () => {
    const users = await User.find({})
    return users
}

const getSingleUser = async (userId: string) => {
    const isUserExists = await User.findById(userId).select("-password")
    if (!isUserExists) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found!")
    }

    return isUserExists
}
const getMe = async (userId: string) => {
    const isUserExists = await User.findById(userId).select("-password")
    if (!isUserExists) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found!")
    }

    return isUserExists
}

export const userService = {
    createUser,
    getAllUser,
    updateUser,
    getMe,
    getSingleUser
}