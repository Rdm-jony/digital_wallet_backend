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
exports.userService = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const wallet_model_1 = require("../wallet/wallet.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const email = payload.email;
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "user already exists!!");
    }
    const hashPassword = bcryptjs_1.default.hashSync(payload.password, parseInt(env_1.envVars.BCRYPT_SALT));
    const authProvider = {
        provider: 'credentials',
        providerId: email
    };
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.create([Object.assign(Object.assign({}, payload), { auth: [authProvider], password: hashPassword })], { session });
        yield wallet_model_1.Wallet.create([{ balance: 50, user: user[0]._id }], { session });
        const userObj = user[0].toObject();
        delete userObj.password;
        yield session.commitTransaction();
        session.endSession();
        return userObj;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found");
    }
    // যদি রোল User বা Agent হয়, তাহলে শুধু নিজেরই আপডেট করার অনুমতি
    if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.AGENT) {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are unauthorized to update another users profile");
        }
    }
    // / Admin কে SuperAdmin আপডেট করতে দেওয়া যাবে না
    if (decodedToken.role === user_interface_1.Role.ADMIN && isUserExists.role == user_interface_1.Role.SUPER_ADMIN) {
        if (decodedToken.userId !== userId) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to update superadmin profile");
        }
    }
    if (payload.role === user_interface_1.Role.AGENT) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "role updated to agent using agent request");
    }
    // Role পরিবর্তনের অনুমতি
    if (payload.role) {
        // User নিজে role পরিবর্তন করতে পারবে না
        if (decodedToken.role == user_interface_1.Role.USER || decodedToken.role == user_interface_1.Role.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
        // Admin SuperAdmin role দিতে পারবে না
        if (payload.role == user_interface_1.Role.SUPER_ADMIN && decodedToken.role == user_interface_1.Role.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // কিছু ফিল্ড শুধু admin বা superadmin আপডেট করতে পারবে
    if (payload.isBlocked || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true }).select("-password");
    if (isUserExists.picture) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)(isUserExists.picture);
    }
    return newUpdatedUser;
});
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: user_interface_1.Role.USER });
    return users;
});
const getAllAgent = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({ role: user_interface_1.Role.AGENT });
    return users;
});
const getSingleUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    return isUserExists;
});
const getMe = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId).select("-password");
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "user not found!");
    }
    return isUserExists;
});
const requestAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(404, "User not found");
    }
    if (isUserExists.agentRequest === "PENDING") {
        throw new AppError_1.default(400, "Already requested");
    }
    isUserExists.agentRequest = user_interface_1.AgentStatus.PENDING;
    yield isUserExists.save();
});
const approveAgentRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(404, "User not found");
    }
    if (isUserExists.agentRequest == user_interface_1.AgentStatus.APPROVED) {
        throw new AppError_1.default(400, "Already approved");
    }
    isUserExists.role = user_interface_1.Role.AGENT;
    isUserExists.agentRequest = user_interface_1.AgentStatus.APPROVED;
    yield isUserExists.save();
});
const suspendAgentRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(404, "User not found");
    }
    if (isUserExists.agentRequest == user_interface_1.AgentStatus.SUSPENDED) {
        throw new AppError_1.default(400, "Already suspended");
    }
    isUserExists.agentRequest = user_interface_1.AgentStatus.SUSPENDED;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        yield isUserExists.save({ session });
        yield wallet_model_1.Wallet.updateOne({ user: isUserExists._id }, { $set: { isBlocked: true } }, { session });
        yield session.abortTransaction();
        session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.userService = {
    createUser,
    getAllUser,
    getAllAgent,
    updateUser,
    getMe,
    getSingleUser,
    requestAgent,
    approveAgentRequest,
    suspendAgentRequest
};
