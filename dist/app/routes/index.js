"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const otp_route_1 = require("../modules/otp/otp.route");
const transaction_route_1 = require("../modules/transaction/transaction.route");
const wallet_route_1 = require("../modules/wallet/wallet.route");
const ssl_route_1 = require("../modules/sslCommerze/ssl.route");
const stat_route_1 = require("../modules/stat/stat.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes
    },
    {
        path: "/otp",
        route: otp_route_1.otpRoutes
    },
    {
        path: "/transaction",
        route: transaction_route_1.transactionRoutes
    },
    {
        path: "/wallet",
        route: wallet_route_1.walletRoutes
    },
    {
        path: "/ssl",
        route: ssl_route_1.sslRoutes
    }, {
        path: "/stat",
        route: stat_route_1.statRoutes
    }
];
moduleRoutes.forEach(route => exports.router.use(route.path, route.route));
