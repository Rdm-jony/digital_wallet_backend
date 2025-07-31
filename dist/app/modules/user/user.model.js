"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.authProvideSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
exports.authProvideSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    address: { type: String },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    phone: { type: String },
    picture: { type: String },
    role: { type: String, enum: Object.values(user_interface_1.Role), default: user_interface_1.Role.USER },
    agentRequest: { type: String, enum: Object.values(user_interface_1.AgentStatus), default: user_interface_1.AgentStatus.NONE },
    auth: [exports.authProvideSchema]
}, {
    timestamps: true
});
exports.User = (0, mongoose_1.model)("User", userSchema);
