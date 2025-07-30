import { JwtPayload } from "jsonwebtoken";
import { ITransaction, TransferType } from "./transaction.interface";
import { Wallet } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes"
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Transaction } from "./transaction.model";

const addTransaction = async (decodedToken: JwtPayload, payload: Partial<ITransaction>) => {
    const existSendarWallet = await Wallet.findById(payload?.senderWallet)
    const existReceiverWallet = await Wallet.findById(payload?.receiverWallet)

    if (payload.transferType == TransferType.TOPUP) {
        if (!existReceiverWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Receiver wallet not found.");
        }
        if (existReceiverWallet.user.toString() !== decodedToken.userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Unauthorized: You can only top-up your own wallet.");

        }
        existReceiverWallet.balance += payload.amount as number
        await existReceiverWallet.save()
    } else if (payload.transferType == TransferType.WITHDRAW) {
        if (!existSendarWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Sender wallet not found.");
        }
        if (existSendarWallet.user.toString() !== decodedToken.userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Unauthorized: You can only withdraw from your own wallet.");

        }
        if (existSendarWallet.balance < (payload.amount as number)) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Insufficient balance.");

        }
        existSendarWallet.balance -= payload.amount as number
        await existSendarWallet.save()
    } else if (payload.transferType == TransferType.SENDMONEY) {
        if (!existSendarWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Sender  wallet not found.");
        }
        if (!existReceiverWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Receiver wallet not found.");
        }
        if (existSendarWallet.user.toString() !== decodedToken.userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Unauthorized: You can only send from your own wallet.");

        }
        const existReceiverRole = await User.findById(existReceiverWallet.user)

        if (decodedToken.role == Role.AGENT || existReceiverRole?.role == Role.AGENT) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Agents are not allowed to perform send/received in send money.");

        }
        
        if (existSendarWallet.balance < (payload.amount as number)) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Insufficient balance.");
        }
        existSendarWallet.balance -= payload.amount as number
        existReceiverWallet.balance += payload.amount as number

        await existReceiverWallet.save()
        await existSendarWallet.save()
    } else if (payload.transferType == TransferType.CASHIN) {
        if (decodedToken.role != Role.AGENT) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Only agents can perform cash-in.");

        }
        if (!existSendarWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Sender wallet not found.");
        }
        if (!existReceiverWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Receiver wallet not found.");
        }
        if (existSendarWallet.user.toString() !== decodedToken.userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Unauthorized: Agent mismatch.");

        }
        const existReceiverRole = await User.findById(existReceiverWallet.user)
        if (existReceiverRole?.role == Role.AGENT) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Agents cannot cash-in to another agent.");

        }

        if (existSendarWallet.balance < (payload.amount as number)) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Insufficient balance.");
        }
        existReceiverWallet.balance += payload.amount as number
        existSendarWallet.balance -= payload.amount as number

        await existReceiverWallet.save()
        await existSendarWallet.save()


    } else if (payload.transferType == TransferType.CASHOUT) {
        if (decodedToken.role !== Role.USER) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Only USER can perform cash-out.");
        }
        if (!existSendarWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Sender wallet not found.");
        }
        if (!existReceiverWallet) {
            throw new AppError(httpStatusCode.NOT_FOUND, "Receiver wallet not found.");
        }
        if (existSendarWallet.user.toString() !== decodedToken.userId) {
            throw new AppError(httpStatusCode.FORBIDDEN, "Unauthorized: user mismatch.");

        }
        const existReceiverRole = await User.findById(existReceiverWallet.user)
        if (existReceiverRole?.role !== Role.AGENT) {
            throw new AppError(httpStatusCode.FORBIDDEN, "receiver must be a agent.");

        }

        if (existSendarWallet.balance < (payload.amount as number)) {
            throw new AppError(httpStatusCode.FORBIDDEN, "User has insufficient balance.");
        }
        existReceiverWallet.balance += payload.amount as number
        existSendarWallet.balance -= payload.amount as number

        await existReceiverWallet.save()
        await existSendarWallet.save()


    }

    const newTransaction = await Transaction.create(payload)

    return newTransaction


}

export const transactionService = {
    addTransaction
}