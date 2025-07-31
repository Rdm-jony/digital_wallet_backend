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
exports.userController = void 0;
const user_service_1 = require("./user.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const createUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { picture: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path });
    const user = yield user_service_1.userService.createUser(payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "user create successfully",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getAllUser();
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "all user retrived successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getAllAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.userService.getAllAgent();
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "all agents retrived successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.id;
    const decodedToken = req.user;
    const payload = Object.assign(Object.assign({}, req.body), { picture: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path });
    const user = yield user_service_1.userService.updateUser(userId, payload, decodedToken);
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: " user update successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getSingleUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = yield user_service_1.userService.getSingleUser(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const user = yield user_service_1.userService.getMe(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: user,
        message: "user retrived successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const requestAgent = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield user_service_1.userService.requestAgent(decodedToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: null,
        message: "agent request send successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const approveAgentRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    yield user_service_1.userService.approveAgentRequest(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: null,
        message: "agent request approved successfully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const suspenAgentRequest = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    yield user_service_1.userService.suspendAgentRequest(userId);
    (0, sendResponse_1.sendResponse)(res, {
        data: null,
        message: "agent suspended",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
exports.userController = {
    createUser,
    getAllUser,
    getAllAgent,
    updateUser,
    getSingleUser,
    getMe,
    requestAgent,
    approveAgentRequest,
    suspenAgentRequest
};
