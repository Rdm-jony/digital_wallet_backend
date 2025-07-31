import { model, Schema } from "mongoose";
import { ITransaction, PaymentStatus, TransferType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    transferType: { type: String, enum: Object.values(TransferType) },
    status: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    amount: { type: Number, min: [1, "Balance must greate than 0"] },
    senderWallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet"
    },
    receiverWallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet"
    }

}, {
    timestamps: true
})

export const Transaction = model("Transaction", transactionSchema)