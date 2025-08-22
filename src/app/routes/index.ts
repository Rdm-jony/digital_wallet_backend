import { Router } from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { otpRoutes } from "../modules/otp/otp.route";
import { transactionRoutes } from "../modules/transaction/transaction.route";
import { walletRoutes } from "../modules/wallet/wallet.route";
import { sslRoutes } from "../modules/sslCommerze/ssl.route";
export const router = Router()
const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/otp",
        route: otpRoutes
    },
    {
        path: "/transaction",
        route: transactionRoutes
    },
    {
        path: "/wallet",
        route: walletRoutes
    },
    {
        path: "/ssl",
        route: sslRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))