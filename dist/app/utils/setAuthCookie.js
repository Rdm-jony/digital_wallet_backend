"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const setAuthCookie = (res, tokens) => {
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            secure: true,
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
