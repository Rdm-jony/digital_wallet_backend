/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import { IUser } from "../user/user.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes"
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setAuthCookie";
import { createUsersToken } from "../../utils/createUsersToken";
import { authService } from "./auth.service";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: Partial<IUser>) => {
        if (err) {
            return next(new AppError(httpStatusCode.BAD_REQUEST, err))
        }
        if (!user) {
            return next(new AppError(httpStatusCode.BAD_REQUEST, "Invalid credentials."))

        }
        const authTokens = createUsersToken(user)
        setAuthCookie(res, authTokens)
        sendResponse(res, {
            data: user,
            message: "user logged in successfully!",
            success: true,
            statusCode: httpStatusCode.CREATED
        })
    })(req, res, next)

})

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "No refresh token recieved from cookies")

    }

    const newAccessToken = await authService.getNewAccessToken(refreshToken)
    setAuthCookie(res, newAccessToken)
    sendResponse(res, {
        data: newAccessToken,
        message: "New Access Token Retrived Successfully",
        success: true,
        statusCode: httpStatusCode.OK
    })
})
const googleCallback = catchAsync(async (req: Request, res: Response) => {
    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user

    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User Not Found")
    }
    const tokenInfo = createUsersToken(user)
    setAuthCookie(res, tokenInfo)

    res.redirect(`${envVars.FRONT_END_URL}/${redirectTo}`)

})
const changePassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    await authService.changePassword(newPassword, oldPassword, decodedToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})

const setPassword = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const plainPassword = req.body.plainPassword;
    await authService.setPassword(plainPassword, decodedToken.userId)

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Password set Successfully",
        data: null,
    })
})

const logout = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body
    await authService.forgetPassword(email)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})
const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body
    const decodedToken = req.user as JwtPayload
    await authService.resetPassword(payload, decodedToken)
    sendResponse(res, {
        success: true,
        statusCode: httpStatusCode.OK,
        message: "password change Successfully",
        data: null,
    })
})


export const authController = { credentialsLogin, getNewAccessToken, googleCallback, changePassword, setPassword, logout, forgetPassword,resetPassword }