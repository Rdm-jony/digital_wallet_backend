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
exports.globalErrorHandler = void 0;
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const env_1 = require("../config/env");
const handleZodeError_1 = require("../errorHelpers/handleZodeError");
const handleCastError_1 = require("../errorHelpers/handleCastError");
const handleDuplicateError_1 = require("../errorHelpers/handleDuplicateError");
const handleValidationError_1 = require("../errorHelpers/handleValidationError");
const cloudinary_config_1 = require("../config/cloudinary.config");
/* eslint-disable @typescript-eslint/no-explicit-any */
const globalErrorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (env_1.envVars.NODE_ENV == "development") {
        console.log(err);
    }
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.path) {
        yield (0, cloudinary_config_1.deleteImageFromCloudinary)((_b = req.file) === null || _b === void 0 ? void 0 : _b.path);
    }
    let statusCode = 500;
    let message = "something went wrong";
    let errorSources = [];
    if (err.code == 11000) {
        const simplifiedError = (0, handleDuplicateError_1.handleDuplicateError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    if (err.name == "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.handlerValidationError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    if (err.name == "CastError") {
        const simplifiedError = (0, handleCastError_1.hendleCastError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
    }
    else if (err.name === 'ZodError') {
        const simplifiedError = (0, handleZodeError_1.handleZodError)(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof Error) {
        message = err.message;
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: env_1.envVars.NODE_ENV == "development" ? err.stack : null
    });
});
exports.globalErrorHandler = globalErrorHandler;
