"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("./transaction.interface");
const transactionSchema = new mongoose_1.Schema({
    transferType: { type: String, enum: Object.values(transaction_interface_1.TransferType) },
    status: { type: String, enum: Object.values(transaction_interface_1.PaymentStatus), default: transaction_interface_1.PaymentStatus.PENDING },
    amount: { type: Number, min: [1, "Balance must greate than 0"] },
    ssl_tran_id: { type: String },
    senderWallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet"
    },
    receiverWallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet"
    },
}, {
    timestamps: true
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
