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
/* eslint-disable @typescript-eslint/no-explicit-any */
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_model_1 = require("../modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("./env");
const user_interface_1 = require("../modules/user/user.interface");
const AppError_1 = __importDefault(require("../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// Local Strategy
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            return done("User does not exist");
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
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, isUserExist.password);
        if (!isPasswordCorrect) {
            return done("Invalid email or password.");
        }
        const user = isUserExist.toObject();
        delete user.password;
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
// Google Strategy
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVars.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVars.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVars.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email) {
            return done(null, false, { mesaage: "No email found" });
        }
        let isUserExist = yield user_model_1.User.findOne({ email });
        if (!isUserExist) {
            const authProvider = {
                provider: "google",
                providerId: profile.id
            };
            isUserExist = yield user_model_1.User.create({
                email: email,
                name: profile === null || profile === void 0 ? void 0 : profile.displayName,
                auth: [authProvider],
                isVerified: true,
                picture: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value
            });
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
        return done(null, isUserExist);
    }
    catch (error) {
        return done(error);
    }
})));
// Serialize user for session
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
// Deserialize user from session
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
