import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { transactionService } from "./transaction.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatusCode from "http-status-codes"
import { JwtPayload } from "jsonwebtoken";

const transactionTopup = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const newTransaction = await transactionService.transactionTopup(decodedToken, req.body)

    sendResponse(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
}))
const transactionWithdraw = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    console.log(req.body)
    const newTransaction = await transactionService.transactionWithdraw(decodedToken, req.body)

    sendResponse(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
}))
const transactionSendMoney = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const newTransaction = await transactionService.transactionSendMoney(decodedToken, req.body)

    sendResponse(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
}))
const transactionCashin = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const newTransaction = await transactionService.transactionCashin(decodedToken, req.body)

    sendResponse(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
}))
const transactionCashout = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const newTransaction = await transactionService.transactionCashout(decodedToken, req.body)

    sendResponse(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: httpStatusCode.CREATED,
        success: true
    })
}))
const getTransactionHistory = (catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const transactionHistory = await transactionService.getTransactionHistory(decodedToken.userId)

    sendResponse(res, {
        data: transactionHistory,
        message: "Transaction history retrieved successfull",
        statusCode: httpStatusCode.OK,
        success: true
    })
}))
const getAllTransaction = (catchAsync(async (req: Request, res: Response) => {
    const allTransaction = await transactionService.getAllTransaction()

    sendResponse(res, {
        data: allTransaction,
        message: "All Transaction history retrieved successfull",
        statusCode: httpStatusCode.OK,
        success: true
    })
}))


export const transactionController = {
    transactionTopup,
    transactionSendMoney,
    transactionWithdraw,
    transactionCashin,
    transactionCashout,
    getTransactionHistory,
    getAllTransaction
}