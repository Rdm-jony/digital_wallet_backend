import { Types } from "mongoose";

export interface ISSLCommerz {
    name: string,
    email: string,
    address: string,
    amount: number,
    phone: number,
    walletId:Types.ObjectId,
    transactionId: string
}