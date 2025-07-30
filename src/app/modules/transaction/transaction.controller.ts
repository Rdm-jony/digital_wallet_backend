import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { transactionService } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";

const addTransaction = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken=req.user as JwtPayload
    const newTransaction = await transactionService.addTransaction(decodedToken,req.body)

    sendResponse(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
}))

export const transactionController = {
    addTransaction
}