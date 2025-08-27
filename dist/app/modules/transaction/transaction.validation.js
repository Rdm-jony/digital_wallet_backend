"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashOutSchema = exports.cashInSchema = exports.sendMoneySchema = exports.toupSchema = exports.withDrawSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.withDrawSchema = zod_1.default.object({
    amount: zod_1.default.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
});
exports.toupSchema = zod_1.default.object({
    amount: zod_1.default.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
});
exports.sendMoneySchema = zod_1.default.object({
    amount: zod_1.default.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
    receiverWallet: zod_1.default.string().nonempty("required"),
});
exports.cashInSchema = zod_1.default.object({
    amount: zod_1.default.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
    receiverWallet: zod_1.default.string().nonempty("required"),
});
exports.cashOutSchema = zod_1.default.object({
    amount: zod_1.default.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
    receiverWallet: zod_1.default.string().nonempty("required"),
});
