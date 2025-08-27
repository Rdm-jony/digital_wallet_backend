import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { statSevices } from "./stat.service"
import { JwtPayload } from "jsonwebtoken"
import { sendResponse } from "../../utils/sendResponse"

const getTransactionStat = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const statTransaction = await statSevices.getTransactionStat(decodedToken.userId)

    sendResponse(res, {
        message: "Transaction stat retriived successfully",
        statusCode: 200,
        data: statTransaction,
        success: true
    })
})

const getUserStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await statSevices.getUserStats();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
});

export const statController={
    getTransactionStat,
    getUserStats
}