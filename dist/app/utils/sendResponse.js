"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    return res.status(data.statusCode).json({
        data: data.data,
        message: data.message,
        statusCode: data.statusCode,
        success: data.success
    });
};
exports.sendResponse = sendResponse;
