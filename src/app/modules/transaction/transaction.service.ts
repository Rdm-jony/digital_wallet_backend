import { JwtPayload } from "jsonwebtoken";
import { ITransaction, PaymentStatus, TransferType } from "./transaction.interface";
import { Wallet } from "../wallet/wallet.model";
import AppError from "../../errorHelpers/AppError";
import httpStatusCode from "http-status-codes"
import { Role } from "../user/user.interface";
import { User } from "../user/user.model";
import { Transaction } from "./transaction.model";
import mongoose from "mongoose";
import { getValidateWallet } from "../../utils/getValidateWallet";


const transactionTopup = async (decodedToken: JwtPayload, payload: Partial<ITransaction>) => {
    const existReceiverWallet = await getValidateWallet(decodedToken.userId, "receiver")
    existReceiverWallet.balance += payload.amount as number
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await existReceiverWallet.save({ session })
        const [newTransaction] = await Transaction.create([{
            ...payload,
            receiverWallet: existReceiverWallet._id,
            transferType: TransferType.TOPUP,
            status: PaymentStatus.SUCCESS
        }], { session });
        await session.commitTransaction()
        session.endSession()
        return newTransaction
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }
}
const transactionWithdraw = async (decodedToken: JwtPayload, payload: Partial<ITransaction>) => {

    const existSendarWallet = await getValidateWallet(decodedToken.userId, "your")
    if (existSendarWallet.balance < (payload.amount as number)) {
        throw new AppError(httpStatusCode.FORBIDDEN, "Insufficient balance.");

    }
    existSendarWallet.balance -= payload.amount as number

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await existSendarWallet.save({ session })
        const [newTransaction] = await Transaction.create([{
            ...payload,
            senderWallet: existSendarWallet._id,
            transferType: TransferType.WITHDRAW,
            status: PaymentStatus.SUCCESS
        }], { session });
        await session.commitTransaction()
        session.endSession()
        return newTransaction
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }
}

const transactionSendMoney = async (decodedToken: JwtPayload, payload: Partial<ITransaction>) => {
    if (!payload?.receiverWallet) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Receiver wallet is required");
    }
    const existReceiverWallet = await getValidateWallet(payload?.receiverWallet, "receiver")
    const existSendarWallet = await getValidateWallet(decodedToken.userId, "your")

    const existReceiverRole = await User.findById(existReceiverWallet.user)

    if (existReceiverRole?.role == Role.AGENT) {
        throw new AppError(httpStatusCode.FORBIDDEN, "receiver wallet is a agent.you cannot send money");

    }

    if (existReceiverRole?._id.toString() === decodedToken.userId) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "receiver wallet is you.you cannot send money to you");

    }

    if (existSendarWallet.balance < (payload.amount as number)) {
        throw new AppError(httpStatusCode.FORBIDDEN, "Insufficient balance.");
    }
    existSendarWallet.balance -= payload.amount as number
    existReceiverWallet.balance += payload.amount as number
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await existReceiverWallet.save({ session })
        await existSendarWallet.save({ session })
        const [newTransaction] = await Transaction.create([{
            ...payload,
            senderWallet: existSendarWallet._id,
            transferType: TransferType.SENDMONEY,
            status: PaymentStatus.SUCCESS
        }], { session });
        await session.commitTransaction()
        session.endSession()
        return newTransaction
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }
}
const transactionCashin = async (decodedToken: JwtPayload, payload: Partial<ITransaction>) => {
    if (!payload?.receiverWallet) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Receiver wallet is required");
    }
    const existReceiverWallet = await getValidateWallet(payload?.receiverWallet, "receiver")
    const existSendarWallet = await getValidateWallet(decodedToken.userId, "your")

    const existReceiverRole = await User.findById(existReceiverWallet.user)
    if (existReceiverRole?.role == Role.AGENT) {
        throw new AppError(httpStatusCode.FORBIDDEN, "Agents cannot cash-in to another agent.");

    }

    if (existSendarWallet.balance < (payload.amount as number)) {
        throw new AppError(httpStatusCode.FORBIDDEN, "Insufficient balance.");
    }
    existReceiverWallet.balance += payload.amount as number
    existSendarWallet.balance -= payload.amount as number

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await existReceiverWallet.save({ session })
        await existSendarWallet.save({ session })

        const [newTransaction] = await Transaction.create([{
            ...payload,
            senderWallet: existSendarWallet._id,
            transferType: TransferType.CASHIN,
            status: PaymentStatus.SUCCESS
        }], { session })
        await session.commitTransaction()
        session.endSession()
        return newTransaction
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }
}
const transactionCashout = async (decodedToken: JwtPayload, payload: Partial<ITransaction>) => {
    if (!payload?.receiverWallet) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "Receiver wallet is required");
    }
    const existReceiverWallet = await getValidateWallet(payload?.receiverWallet, "receiver")
    const existSendarWallet = await getValidateWallet(decodedToken.userId, "your")


    const existReceiverRole = await User.findById(existReceiverWallet.user)
    if (existReceiverRole?.role !== Role.AGENT) {
        throw new AppError(httpStatusCode.FORBIDDEN, "receiver must be a agent.");

    }

    if (existSendarWallet.balance < (payload.amount as number)) {
        throw new AppError(httpStatusCode.FORBIDDEN, "User has insufficient balance.");
    }
    existReceiverWallet.balance += payload.amount as number
    existSendarWallet.balance -= payload.amount as number

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await existReceiverWallet.save({ session })
        await existSendarWallet.save({ session })

        const [newTransaction] = await Transaction.create([{
            ...payload,
            senderWallet: existSendarWallet._id,
            transferType: TransferType.CASHOUT,
            status: PaymentStatus.SUCCESS
        }], { session });
        await session.commitTransaction()
        session.endSession()
        return newTransaction
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error;
    }
}

const getTransactionHistory = async (userId: string) => {
    const isWalletExist = await Wallet.findOne({ user: userId })
    if (!isWalletExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "wallet not found")
    }
    return await Transaction.find({
        $or: [{ senderWallet: isWalletExist }, { receiverWallet: isWalletExist }]
    });
}

export const transactionService = {
    getTransactionHistory,
    transactionTopup,
    transactionWithdraw,
    transactionSendMoney,
    transactionCashin,
    transactionCashout
}