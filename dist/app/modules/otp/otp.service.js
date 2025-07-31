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
exports.otpSrvice = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const redis_config_1 = require("../../config/redis.config");
const generateOtp_1 = require("../../utils/generateOtp");
const sendMail_1 = require("../../utils/sendMail");
const otpExpireTime = 2 * 60;
const sendOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    if (user.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user already verified!");
    }
    const otpKey = `otp:${user.email}`;
    const otp = (0, generateOtp_1.generateOtp)();
    yield redis_config_1.redisClient.set(otpKey, otp, {
        expiration: {
            type: "EX",
            value: otpExpireTime
        }
    });
    yield (0, sendMail_1.sendMail)({
        to: user.email,
        subject: "Your Otp Code",
        templateName: "otp",
        templateData: {
            name: user.name,
            otp: otp
        }
    });
});
const verifyOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: payload.email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    if (user.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user already verified!");
    }
    const otpKey = `otp:${user.email}`;
    const savedOtp = yield redis_config_1.redisClient.get(otpKey);
    if (payload.otp !== savedOtp) {
        throw new AppError_1.default(401, "Invalid OTP");
    }
    yield Promise.all([
        user_model_1.User.updateOne({ email: payload.email }, { isVerified: true }),
        redis_config_1.redisClient.del([otpKey])
    ]);
});
exports.otpSrvice = {
    sendOtp,
    verifyOtp
};
