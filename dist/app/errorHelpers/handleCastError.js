"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hendleCastError = void 0;
const hendleCastError = (err) => {
    return {
        statusCode: 400,
        message: "Invalid MongoDB ObjectID. Please provide a valid id",
    };
};
exports.hendleCastError = hendleCastError;
