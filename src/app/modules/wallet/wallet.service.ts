import AppError from "../../errorHelpers/AppError"
import { Wallet } from "./wallet.model"
import httpStatusCode from "http-status-codes"

const getWallet = async (userId: string) => {
    const isWalletExist = await Wallet.findOne({ user: userId })
    if (!isWalletExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "no wallet found")
    }
    if (isWalletExist.isBlocked) {
        throw new AppError(httpStatusCode.NOT_FOUND, "your wallet is blocked")

    }

    return isWalletExist
}

const blockWallet = async (walletId: string) => {
    const isWalletExist = await Wallet.findById(walletId)
    if (!isWalletExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "no wallet found")
    }
    if (isWalletExist.isBlocked) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "this wallet already blocked")

    }
    isWalletExist.isBlocked = true
    await isWalletExist.save()
}
const unblockWallet = async (walletId: string) => {
    const isWalletExist = await Wallet.findById(walletId)
    if (!isWalletExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "no wallet found")
    }
    if (!isWalletExist.isBlocked) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "this wallet already unblocked")

    }
    isWalletExist.isBlocked = false
    await isWalletExist.save()
}

export const walletService = {
    getWallet,
    blockWallet,
    unblockWallet
}