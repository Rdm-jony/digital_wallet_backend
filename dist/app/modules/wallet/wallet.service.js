"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const wallet_model_1 = require("./wallet.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isWalletExist = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!isWalletExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "no wallet found");
    }
    if (isWalletExist.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "your wallet is blocked");
    }
    return isWalletExist;
});
const blockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const isWalletExist = yield wallet_model_1.Wallet.findById(walletId);
    if (!isWalletExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "no wallet found");
    }
    if (isWalletExist.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "this wallet already blocked");
    }
    isWalletExist.isBlocked = true;
    yield isWalletExist.save();
});
const unblockWallet = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
    const isWalletExist = yield wallet_model_1.Wallet.findById(walletId);
    if (!isWalletExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "no wallet found");
    }
    if (!isWalletExist.isBlocked) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "this wallet already unblocked");
    }
    isWalletExist.isBlocked = false;
    yield isWalletExist.save();
});
const getAllWallet = () => __awaiter(void 0, void 0, void 0, function* () {
    const allWallet = yield wallet_model_1.Wallet.find({});
    return allWallet;
});
exports.walletService = {
    getWallet,
    getAllWallet,
    blockWallet,
    unblockWallet
};
