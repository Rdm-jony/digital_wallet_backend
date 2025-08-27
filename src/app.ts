/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import passport from "passport";
import { envVars } from "./app/config/env";
import './app/config/passport';
import cookieParser from "cookie-parser";
import cors from "cors"
import notFound from "./app/middlewares/notFound";
const app = express()

app.use(express.json())
app.use(cookieParser())
app.set("trust proxy", 1)
app.use(cors({
    origin: ["http://localhost:5173", // local dev
        "https://digital-wallet-frontend-five.vercel.app"],// production frontend],
    credentials: true
}))
app.use(
    session({
        secret: envVars.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
)
app.use("/api/v1", router)

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.get('/', async (req: Request, res: Response) => {
    res.status(200).json({ success: true, message: "user auth server running...✔" })
})

app.use(globalErrorHandler)
app.use(notFound)

export default app