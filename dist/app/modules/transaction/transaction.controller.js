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
exports.transactionController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const transaction_service_1 = require("./transaction.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const transactionTopup = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newTransaction = yield transaction_service_1.transactionService.transactionTopup(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
})));
const transactionWithdraw = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    console.log(req.body);
    const newTransaction = yield transaction_service_1.transactionService.transactionWithdraw(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
})));
const transactionSendMoney = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newTransaction = yield transaction_service_1.transactionService.transactionSendMoney(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
})));
const transactionCashin = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newTransaction = yield transaction_service_1.transactionService.transactionCashin(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
})));
const transactionCashout = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const newTransaction = yield transaction_service_1.transactionService.transactionCashout(decodedToken, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        data: newTransaction,
        message: "Transaction successfull",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
})));
const getTransactionHistory = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const transactionHistory = yield transaction_service_1.transactionService.getTransactionHistory(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: transactionHistory,
        message: "Transaction history retrieved successfull",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
})));
const getAllTransaction = ((0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allTransaction = yield transaction_service_1.transactionService.getAllTransaction();
    (0, sendResponse_1.sendResponse)(res, {
        data: allTransaction,
        message: "All Transaction history retrieved successfull",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
})));
exports.transactionController = {
    transactionTopup,
    transactionSendMoney,
    transactionWithdraw,
    transactionCashin,
    transactionCashout,
    getTransactionHistory,
    getAllTransaction
};
