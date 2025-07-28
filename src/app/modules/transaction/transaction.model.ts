import { model, Schema } from "mongoose";
import { ITransaction, PaymentStatus, TransferType } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    transferType: { type: String, enum: Object.values(TransferType), required: true },
    status: { type: String, enum: Object.values(PaymentStatus), required: true },
    amount: { type: Number, default: 0, min: [0, "Balance cannot be negative"] },
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