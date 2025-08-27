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
exports.SSLService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const transaction_model_1 = require("../transaction/transaction.model");
const transaction_interface_1 = require("../transaction/transaction.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_2 = __importDefault(require("http-status-codes"));
const sslPaymentInit = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            store_id: env_1.envVars.SSL.SSL_STORE_ID,
            store_passwd: env_1.envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${env_1.envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&walletId=${payload.walletId}&status=success`,
            fail_url: `${env_1.envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&walletId=${payload.walletId}&status=fail`,
            cancel_url: `${env_1.envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&walletId=${payload.walletId}&status=cancel`,
            // ipn_url: envVars.SSL.SSl_i,
            shipping_method: "N/A",
            product_name: "Top Up Money",
            product_category: "N/A",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phone,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };
        const response = yield (0, axios_1.default)({
            method: "POST",
            url: env_1.envVars.SSL.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data;
    }
    catch (error) {
        console.log("Payment Error Occured", error);
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, error.message);
    }
});
const sslSuccess = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1️⃣ Update transaction status within the session
        const updateTransaction = yield transaction_model_1.Transaction.findOneAndUpdate({ ssl_tran_id: query.transactionId }, { status: transaction_interface_1.PaymentStatus.SUCCESS }, { session, new: true });
        console.log(updateTransaction);
        if (!updateTransaction)
            throw new AppError_1.default(http_status_codes_2.default.NOT_FOUND, "transaction not found");
        // 2️⃣ Update wallet balance within the session
        const wallet = yield wallet_model_1.Wallet.findById(query.walletId).session(session);
        if (!wallet)
            throw new AppError_1.default(http_status_codes_2.default.NOT_FOUND, "Wallet not found");
        const amount = Number(query.amount);
        wallet.balance += amount;
        yield wallet.save({ session });
        // 3️⃣ Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment processed successfully" };
    }
    catch (error) {
        // 4️⃣ Abort transaction on error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const sslFail = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1️⃣ Update transaction status within the session
        const updateTransaction = yield transaction_model_1.Transaction.findOneAndUpdate({ ssl_tran_id: query.transactionId }, { status: transaction_interface_1.PaymentStatus.FAILED }, { session, new: true });
        if (!updateTransaction)
            throw new AppError_1.default(http_status_codes_2.default.NOT_FOUND, "transaction not found");
        // 3️⃣ Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment processed successfully" };
    }
    catch (error) {
        // 4️⃣ Abort transaction on error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const sslCancel = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // 1️⃣ Update transaction status within the session
        const updateTransaction = yield transaction_model_1.Transaction.findOneAndUpdate({ ssl_tran_id: query.transactionId }, { status: transaction_interface_1.PaymentStatus.CANCELED }, { session, new: true });
        if (!updateTransaction)
            throw new AppError_1.default(http_status_codes_2.default.NOT_FOUND, "transaction not found");
        // 3️⃣ Commit transaction
        yield session.commitTransaction();
        session.endSession();
        return { success: true, message: "Payment processed successfully" };
    }
    catch (error) {
        // 4️⃣ Abort transaction on error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.SSLService = {
    sslPaymentInit,
    sslSuccess,
    sslFail,
    sslCancel
};
