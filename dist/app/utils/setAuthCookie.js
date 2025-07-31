"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = void 0;
const env_1 = require("../config/env");
const setAuthCookie = (res, tokens) => {
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV == "production",
            sameSite: "none"
        });
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            secure: env_1.envVars.NODE_ENV == "production",
            sameSite: "none"
        });
    }
};
exports.setAuthCookie = setAuthCookie;
