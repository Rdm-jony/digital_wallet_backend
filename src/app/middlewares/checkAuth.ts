import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { verifyToken } from "../utils/jwt"
import { envVars } from "../config/env"
import { User } from "../modules/user/user.model"
import { JwtPayload } from "jsonwebtoken"
import httpStatusCode from "http-status-codes"
import { IsActive } from "../modules/user/user.interface"

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            throw new AppError(403, "No Token Recieved")
        }

        const decodedToken = verifyToken(token, envVars.JWT_ACCESS_TOKEN_SECRET) as JwtPayload
        const isUserExist = await User.findById(decodedToken.userId)
        if (!isUserExist) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "User does not exist")

        }

        if (!isUserExist.isVerified) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified")

        }

        if (isUserExist.isActive !== IsActive.ACTIVE) {
            throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActive}`)

        }

        if (isUserExist.isDeleted) {
            throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted")

        }

        if (!authRoles.includes(decodedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")

        }
        req.user = decodedToken
        next()
    } catch (error) {
        next(error)
    }
}