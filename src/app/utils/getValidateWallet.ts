import { Types } from "mongoose";
import AppError from "../errorHelpers/AppError";
import { Wallet } from "../modules/wallet/wallet.model";
import httpStatusCode from "http-status-codes"

export const getValidateWallet = async (userId: string | Types.ObjectId, label: "your" | "receiver") => {
    let wallet;
    if (label == "your") {
        wallet = await Wallet.findOne({ user: userId }).populate("user")
    } else if (label == "receiver") {
        wallet = await Wallet.findById(userId).populate("user")
    }

    if (!wallet) {
        throw new AppError(httpStatusCode.NOT_FOUND, `${label} wallet not found.`);
    }
    if (wallet?.isBlocked) {
        throw new AppError(httpStatusCode.BAD_REQUEST, `${label}wallet is blocked`)
    }

    return wallet
}