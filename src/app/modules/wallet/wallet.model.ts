import { model, Schema } from "mongoose";
import { IWallet } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: { type: Number, default: 0, min: [0, "Balance cannot be negative"] },
    isBlocked: {type:Boolean,default:false}
}, {
    timestamps: true
})

export const Wallet = model("Wallet", walletSchema)