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
exports.authService = void 0;
const createUsersToken_1 = require("../../utils/createUsersToken");
const user_model_1 = require("../user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../config/env");
const user_interface_1 = require("../user/user.interface");
const jwt_1 = require("../../utils/jwt");
const sendMail_1 = require("../../utils/sendMail");
const getNewAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield (0, createUsersToken_1.generateNewAccessTokenByRefreshToken)(refreshToken);
    return {
        accessToken
    };
});
const changePassword = (newPassword, oldPassword, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(decodedToken.userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const isOldPasswordMatch = yield bcryptjs_1.default.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isOldPasswordMatch) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Old Password does not match");
    }
    user.password = bcryptjs_1.default.hashSync(newPassword, Number(env_1.envVars.BCRYPT_SALT));
    yield (user === null || user === void 0 ? void 0 : user.save());
});
const setPassword = (plainPassword, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (user.password && user.auth.some(providerObj => providerObj.provider == "google")) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update");
    }
    const hashNewPassword = yield bcryptjs_1.default.hash(plainPassword, Number(env_1.envVars.BCRYPT_SALT));
    user.password = hashNewPassword;
    const newAuth = {
        provider: "credentials",
        providerId: user.email
    };
    user.auth = [...user.auth, newAuth];
    yield user.save();
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found");
    }
    if (!isUserExist.isVerified) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is not verified");
    }
    if (isUserExist.isBlocked || isUserExist.agentRequest == user_interface_1.AgentStatus.SUSPENDED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is blocked or suspended`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User is deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const resetToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_TOKEN_SECRET, "10m");
    const resetUiLink = `${env_1.envVars.FRONT_END_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;
    yield (0, sendMail_1.sendMail)({
        to: isUserExist.email,
        subject: "Reset Password",
        templateName: 'forgetPassword',
        templateData: {
            name: isUserExist.name,
            resetUiLink
        }
    });
});
const resetPassword = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.id != decodedToken.userId) {
        throw new AppError_1.default(401, "You can not reset your password");
    }
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.default(401, "User does not exist");
    }
    isUserExist.password = yield bcryptjs_1.default.hash(payload.newPassword, Number(env_1.envVars.BCRYPT_SALT));
    yield isUserExist.save();
});
exports.authService = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgetPassword,
    resetPassword
};
