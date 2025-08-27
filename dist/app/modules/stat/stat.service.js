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
exports.statSevices = void 0;
const transaction_model_1 = require("../transaction/transaction.model");
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getTransactionStat = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isWalletExist = yield wallet_model_1.Wallet.findOne({ user: userId });
    if (!(isWalletExist === null || isWalletExist === void 0 ? void 0 : isWalletExist._id))
        return [];
    const walletId = isWalletExist._id;
    const stats = yield transaction_model_1.Transaction.aggregate([
        {
            $match: {
                status: "SUCCESS", // ✅ only successful transactions
                $or: [
                    // TOPUP: wallet as sender OR receiver
                    {
                        transferType: "TOPUP",
                        $or: [{ senderWallet: walletId }, { receiverWallet: walletId }],
                    },
                    // WITHDRAW: wallet as sender OR receiver
                    {
                        transferType: "WITHDRAW",
                        $or: [{ senderWallet: walletId }, { receiverWallet: walletId }],
                    },
                    // OTHERS: only wallet as sender
                    {
                        transferType: { $nin: ["TOPUP", "WITHDRAW"] },
                        senderWallet: walletId,
                    },
                ],
            },
        },
        {
            $group: {
                _id: "$transferType",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                transferType: "$_id",
                totalAmount: 1,
                count: 1,
            },
        },
    ]);
    return stats;
});
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({ isBlocked: true });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = yield Promise.all([
        totalUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ]);
    return {
        totalUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    };
});
exports.statSevices = {
    getTransactionStat,
    getUserStats
};
