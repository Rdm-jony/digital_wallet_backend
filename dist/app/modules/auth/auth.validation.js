"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetPasswordSchema = exports.resetPasswordSchema = exports.loginShema = exports.setPasswordShema = exports.changePasswordShema = void 0;
const zod_1 = __importDefault(require("zod"));
const strongPassword = zod_1.default.string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least 1 uppercase letter.",
})
    .regex(/^(?=.*[!@#$%^&*])/, {
    message: "Password must contain at least 1 special character.",
})
    .regex(/^(?=.*\d)/, {
    message: "Password must contain at least 1 number.",
})
    .nonempty({ message: "Password is required." });
exports.changePasswordShema = zod_1.default.object({
    oldPassword: zod_1.default.string("not a string").nonempty("required"),
    newPassword: strongPassword
});
exports.setPasswordShema = zod_1.default.object({
    plainPassword: strongPassword
});
exports.loginShema = zod_1.default.object({
    email: zod_1.default.email().nonempty("required"),
    password: zod_1.default.string().nonempty("required")
});
exports.resetPasswordSchema = zod_1.default.object({
    newPassword: strongPassword,
    id: zod_1.default.string().nonempty("required")
});
exports.forgetPasswordSchema = zod_1.default.object({
    email: zod_1.default.email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }).nonempty("required")
});
