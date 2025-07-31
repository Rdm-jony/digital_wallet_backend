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
exports.walletController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const wallet_service_1 = require("./wallet.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const getWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const wallet = yield wallet_service_1.walletService.getWallet(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: wallet,
        message: "your wallet successfully retrieve",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const blocktWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.id;
    yield wallet_service_1.walletService.blockWallet(walletId);
    (0, sendResponse_1.sendResponse)(res, {
        data: null,
        message: "wallet blocked successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const unblocktWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const walletId = req.params.id;
    yield wallet_service_1.walletService.unblockWallet(walletId);
    (0, sendResponse_1.sendResponse)(res, {
        data: null,
        message: "wallet unblocked successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getAllWallet = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allWallet = yield wallet_service_1.walletService.getAllWallet();
    (0, sendResponse_1.sendResponse)(res, {
        data: allWallet,
        message: "wallet unblocked successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
exports.walletController = {
    getWallet,
    getAllWallet,
    blocktWallet,
    unblocktWallet
};
