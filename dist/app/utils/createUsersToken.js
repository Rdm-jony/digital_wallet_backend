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
exports.generateNewAccessTokenByRefreshToken = exports.createUsersToken = void 0;
const env_1 = require("../config/env");
const user_interface_1 = require("../modules/user/user.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const createUsersToken = (user) => {
    const accessToken = (0, jwt_1.generateToken)({ name: user.email, role: user.role, userId: user === null || user === void 0 ? void 0 : user._id }, env_1.envVars.JWT_ACCESS_TOKEN_SECRET, env_1.envVars.JWT_ACCESS_TOKEN_EXPIRESIN);
    const refreshToken = (0, jwt_1.generateToken)({ name: user.email, role: user.role, userId: user === null || user === void 0 ? void 0 : user._id }, env_1.envVars.JWT_REFRESH_TOKEN_SECRET, env_1.envVars.JWT_REFRESH_TOKEN_EXPIRESIN);
    return {
        accessToken,
        refreshToken
    };
};
exports.createUsersToken = createUsersToken;
const generateNewAccessTokenByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.JWT_REFRESH_TOKEN_SECRET);
    const isUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User does not exist");
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
    const accessToken = (0, jwt_1.generateToken)(jwtPayload, env_1.envVars.JWT_ACCESS_TOKEN_SECRET, env_1.envVars.JWT_ACCESS_TOKEN_EXPIRESIN);
    return accessToken;
});
exports.generateNewAccessTokenByRefreshToken = generateNewAccessTokenByRefreshToken;
