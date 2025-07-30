import AppError from "../../errorHelpers/AppError"
import { Wallet } from "./wallet.model"
import httpStatusCode from "http-status-codes"

const getWallet = async(userId: string) => {
    const isWalletExist = await Wallet.findOne({ user: userId })
    if (!isWalletExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "no wallet found")
    }
    if (isWalletExist.isBlocked) {
        throw new AppError(httpStatusCode.NOT_FOUND, "your wallet is blocked")

    }

    return isWalletExist
}

export const walletService = {
    getWallet
}