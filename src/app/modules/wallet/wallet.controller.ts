import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { walletService } from "./wallet.service";
import { JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"

const getWallet = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const wallet = await walletService.getWallet(decodedToken.userId)
    sendResponse(res, {
        data: wallet,
        message: "your wallet successfully retrieve",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

const blocktWallet = catchAsync(async (req: Request, res: Response) => {
    const walletId = req.params.id
    await walletService.blockWallet(walletId)
    sendResponse(res, {
        data: null,
        message: "wallet blocked successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const unblocktWallet = catchAsync(async (req: Request, res: Response) => {
    const walletId = req.params.id
    await walletService.unblockWallet(walletId)
    sendResponse(res, {
        data: null,
        message: "wallet unblocked successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})
const getAllWallet = catchAsync(async (req: Request, res: Response) => {
    const allWallet = await walletService.getAllWallet()
    sendResponse(res, {
        data: allWallet,
        message: "wallet unblocked successfully",
        statusCode: httpStatusCode.OK,
        success: true
    })
})

export const walletController = {
    getWallet,
    getAllWallet,
    blocktWallet,
    unblocktWallet
}