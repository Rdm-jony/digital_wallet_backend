import { envVars } from "../config/env"
import { AgentStatus, IUser } from "../modules/user/user.interface"
import httpStatusCode from "http-status-codes"
import { generateToken, verifyToken } from "./jwt"
import { User } from "../modules/user/user.model"
import AppError from "../errorHelpers/AppError"
import { JwtPayload } from "jsonwebtoken"

export const createUsersToken = (user: Partial<IUser>) => {
    const accessToken = generateToken({ name: user.email, role: user.role, userId: user?._id }, envVars.JWT_ACCESS_TOKEN_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRESIN)
    const refreshToken = generateToken({ name: user.email, role: user.role, userId: user?._id }, envVars.JWT_REFRESH_TOKEN_SECRET, envVars.JWT_REFRESH_TOKEN_EXPIRESIN)

    return {
        accessToken,
        refreshToken
    }
}

export const generateNewAccessTokenByRefreshToken = async (refreshToken: string) => {
    const decodedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_TOKEN_SECRET) as JwtPayload
    const isUserExist = await User.findById(decodedToken.userId)

    if (!isUserExist) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User does not exist")

    }

    if (!isUserExist.isVerified) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified")

    }

    if ( isUserExist.isBlocked || isUserExist.agentRequest==AgentStatus.SUSPENDED) {
        throw new AppError(httpStatusCode.BAD_REQUEST, `User is blocked or suspended`)

    }

    if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted")

    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN_SECRET, envVars.JWT_ACCESS_TOKEN_EXPIRESIN)

    return accessToken
}