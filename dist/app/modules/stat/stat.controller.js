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
Object.defineProperty(exports, "__esModule", { value: true });
exports.statController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const stat_service_1 = require("./stat.service");
const sendResponse_1 = require("../../utils/sendResponse");
const getTransactionStat = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const statTransaction = yield stat_service_1.statSevices.getTransactionStat(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        message: "Transaction stat retriived successfully",
        statusCode: 200,
        data: statTransaction,
        success: true
    });
}));
const getUserStats = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stat_service_1.statSevices.getUserStats();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
}));
exports.statController = {
    getTransactionStat,
    getUserStats
};
