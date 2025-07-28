import { Types } from "mongoose";

export enum TransferType {
    TOPUP = "TOPUP",
    WITHDRAW = "WITHDRAW",
    SENDMONEY = "SENDMONEY",
    CASHIN = "CASHIN",
    CASHOUT = "CASHOUT"
}

export enum PaymentStatus{
    PENDING="PENDING",
    SUCCESS="SUCCESS",
    FAILED="FAILED"
}

export interface ITransaction {
    transferType:TransferType,
    senderWallet :Types.ObjectId | null,
    receiverWallet:Types.ObjectId | null,
    amount:number,
    status:PaymentStatus,
}