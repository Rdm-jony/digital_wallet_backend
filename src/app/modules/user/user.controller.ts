import { Request, Response } from "express";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";



const createUser = catchAsync(async (req: Request, res: Response) => {
    const payload: Partial<IUser> = {
        ...req.body,
        picture: req?.file?.path
    }
    const user = await userService.createUser(payload)
    sendResponse(res, {
        data: user,
        message: "user create successfully",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
})
const getAllUser = catchAsync(async (req: Request, res: Response) => {
    const user = await userService.getAllUser()
    sendResponse(res, {
        data: user,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const decodedToken = req.user as JwtPayload
    const payload: Partial<IUser> = {
        ...req.body,
        picture:req?.file?.path
    }
    const user = await userService.updateUser(userId, payload, decodedToken)
    sendResponse(res, {
        data: user,
        message: "all user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await userService.getSingleUser(userId)
    sendResponse(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const getMe = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const user = await userService.getMe(decodedToken.userId)
    sendResponse(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})



export const userController = {
    createUser,
    getAllUser,
    updateUser,
    getSingleUser,
    getMe
}