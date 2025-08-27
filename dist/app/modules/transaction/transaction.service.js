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
exports.transactionService = void 0;
const transaction_interface_1 = require("./transaction.interface");
const wallet_model_1 = require("../wallet/wallet.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const transaction_model_1 = require("./transaction.model");
const mongoose_1 = __importDefault(require("mongoose"));
const getValidateWallet_1 = require("../../utils/getValidateWallet");
const sslCommerze_service_1 = require("../sslCommerze/sslCommerze.service");
const queryBuilder_1 = require("../../utils/queryBuilder");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.random() * 1000}`;
};
const transactionTopup = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existReceiverWallet = yield (0, getValidateWallet_1.getValidateWallet)(decodedToken.userId, "your");
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const [newTransaction] = yield transaction_model_1.Transaction.create([Object.assign(Object.assign({}, payload), { receiverWallet: existReceiverWallet._id, transferType: transaction_interface_1.TransferType.TOPUP, ssl_tran_id: getTransactionId(), status: transaction_interface_1.PaymentStatus.PENDING })], { session });
        const userAddress = (existReceiverWallet === null || existReceiverWallet === void 0 ? void 0 : existReceiverWallet.user).address;
        const userEmail = (existReceiverWallet === null || existReceiverWallet === void 0 ? void 0 : existReceiverWallet.user).email;
        const userPhoneNumber = (existReceiverWallet === null || existReceiverWallet === void 0 ? void 0 : existReceiverWallet.user).phone;
        const userName = (existReceiverWallet === null || existReceiverWallet === void 0 ? void 0 : existReceiverWallet.user).name;
        const sslPayload = {
            walletId: existReceiverWallet._id,
            address: userAddress,
            email: userEmail,
            phone: userPhoneNumber,
            name: userName,
            amount: payload === null || payload === void 0 ? void 0 : payload.amount,
            transactionId: newTransaction.ssl_tran_id
        };
        const response = yield sslCommerze_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            paymentURL: response.GatewayPageURL,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const transactionWithdraw = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existSendarWallet = yield (0, getValidateWallet_1.getValidateWallet)(decodedToken.userId, "your");
    if (existSendarWallet.balance < payload.amount) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Insufficient balance.");
    }
    existSendarWallet.balance -= payload.amount;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield existSendarWallet.save({ session });
        const [newTransaction] = yield transaction_model_1.Transaction.create([Object.assign(Object.assign({}, payload), { senderWallet: existSendarWallet._id, transferType: transaction_interface_1.TransferType.WITHDRAW, status: transaction_interface_1.PaymentStatus.SUCCESS })], { session });
        yield session.commitTransaction();
        session.endSession();
        return newTransaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const transactionSendMoney = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.receiverWallet)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet is required");
    }
    const existReceiverWallet = yield (0, getValidateWallet_1.getValidateWallet)(payload === null || payload === void 0 ? void 0 : payload.receiverWallet, "receiver");
    const existSendarWallet = yield (0, getValidateWallet_1.getValidateWallet)(decodedToken.userId, "your");
    const existReceiverRole = yield user_model_1.User.findById(existReceiverWallet.user);
    if ((existReceiverRole === null || existReceiverRole === void 0 ? void 0 : existReceiverRole.role) == user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "receiver wallet is a agent.you cannot send money");
    }
    if ((existReceiverRole === null || existReceiverRole === void 0 ? void 0 : existReceiverRole._id.toString()) === decodedToken.userId) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "receiver wallet is you.you cannot send money to you");
    }
    if (existSendarWallet.balance < payload.amount) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Insufficient balance.");
    }
    existSendarWallet.balance -= payload.amount;
    existReceiverWallet.balance += payload.amount;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield existReceiverWallet.save({ session });
        yield existSendarWallet.save({ session });
        const [newTransaction] = yield transaction_model_1.Transaction.create([Object.assign(Object.assign({}, payload), { senderWallet: existSendarWallet._id, transferType: transaction_interface_1.TransferType.SENDMONEY, status: transaction_interface_1.PaymentStatus.SUCCESS })], { session });
        yield session.commitTransaction();
        session.endSession();
        return newTransaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const transactionCashin = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.receiverWallet)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet is required");
    }
    const existReceiverWallet = yield (0, getValidateWallet_1.getValidateWallet)(payload === null || payload === void 0 ? void 0 : payload.receiverWallet, "receiver");
    const existSendarWallet = yield (0, getValidateWallet_1.getValidateWallet)(decodedToken.userId, "your");
    const existReceiverRole = yield user_model_1.User.findById(existReceiverWallet.user);
    if ((existReceiverRole === null || existReceiverRole === void 0 ? void 0 : existReceiverRole.role) == user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Agents cannot cash-in to another agent.");
    }
    if (existSendarWallet.balance < payload.amount) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Insufficient balance.");
    }
    existReceiverWallet.balance += payload.amount;
    existSendarWallet.balance -= payload.amount;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield existReceiverWallet.save({ session });
        yield existSendarWallet.save({ session });
        const [newTransaction] = yield transaction_model_1.Transaction.create([Object.assign(Object.assign({}, payload), { senderWallet: existSendarWallet._id, transferType: transaction_interface_1.TransferType.CASHIN, status: transaction_interface_1.PaymentStatus.SUCCESS })], { session });
        yield session.commitTransaction();
        session.endSession();
        return newTransaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const transactionCashout = (decodedToken, payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.receiverWallet)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet is required");
    }
    const existReceiverWallet = yield (0, getValidateWallet_1.getValidateWallet)(payload === null || payload === void 0 ? void 0 : payload.receiverWallet, "receiver");
    const existSendarWallet = yield (0, getValidateWallet_1.getValidateWallet)(decodedToken.userId, "your");
    const existReceiverRole = yield user_model_1.User.findById(existReceiverWallet.user);
    if ((existReceiverRole === null || existReceiverRole === void 0 ? void 0 : existReceiverRole.role) !== user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "receiver must be a agent.");
    }
    if (existSendarWallet.balance < payload.amount) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User has insufficient balance.");
    }
    existReceiverWallet.balance += payload.amount;
    existSendarWallet.balance -= payload.amount;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield existReceiverWallet.save({ session });
        yield existSendarWallet.save({ session });
        const [newTransaction] = yield transaction_model_1.Transaction.create([Object.assign(Object.assign({}, payload), { senderWallet: existSendarWallet._id, transferType: transaction_interface_1.TransferType.CASHOUT, status: transaction_interface_1.PaymentStatus.SUCCESS })], { session });
        yield session.commitTransaction();
        session.endSession();
        return newTransaction;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getTransactionHistory = (query, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isWalletExist = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!isWalletExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "wallet not found");
    }
    const queryBuilder = new queryBuilder_1.QueryBuilder(transaction_model_1.Transaction.find({ $or: [{ senderWallet: isWalletExist._id }, { receiverWallet: isWalletExist._id }] }), query, userId);
    const transaction = queryBuilder
        // .search(transactionSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const data = yield transaction.build();
    // const [data, meta] = await Promise.all([
    //     queryBuilder.getMeta()
    // ])
    return data;
});
const getAllTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const allTransaction = yield transaction_model_1.Transaction.find({});
    return allTransaction;
});
exports.transactionService = {
    getTransactionHistory,
    transactionTopup,
    transactionWithdraw,
    transactionSendMoney,
    transactionCashin,
    getAllTransaction,
    transactionCashout
};
