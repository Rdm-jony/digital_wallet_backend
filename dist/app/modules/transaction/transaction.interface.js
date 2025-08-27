"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentStatus = exports.TransferType = void 0;
var TransferType;
(function (TransferType) {
    TransferType["TOPUP"] = "TOPUP";
    TransferType["WITHDRAW"] = "WITHDRAW";
    TransferType["SENDMONEY"] = "SENDMONEY";
    TransferType["CASHIN"] = "CASHIN";
    TransferType["CASHOUT"] = "CASHOUT";
})(TransferType || (exports.TransferType = TransferType = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["SUCCESS"] = "SUCCESS";
    PaymentStatus["CANCELED"] = "CANCELED";
    PaymentStatus["FAILED"] = "FAILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
