import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { otpSrvice } from "./otp.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const sendOtp = catchAsync(async (req: Request, res: Response) => {
    await otpSrvice.sendOtp(req.body)

    sendResponse(res, {
        data: null,
        message: "otp sent your email",
        success: true,
        statusCode: httpStatusCode.OK
    })
})
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
    await otpSrvice.verifyOtp(req.body)

    sendResponse(res, {
        data: null,
        message: "verify email successfully",
        success: true,
        statusCode: httpStatusCode.OK
    })
})


export const otpController = {
    sendOtp,
    verifyOtp
}