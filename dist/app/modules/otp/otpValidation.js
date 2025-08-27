"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verfyOtpSchema = exports.sendOtpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.sendOtpSchema = zod_1.default.object({
    email: zod_1.default.email().nonempty("required")
});
exports.verfyOtpSchema = zod_1.default.object({
    email: zod_1.default.email().nonempty("required"),
    otp: zod_1.default.string().nonempty("required")
});
