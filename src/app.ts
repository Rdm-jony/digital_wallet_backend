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
const app = express()

app.use(express.json())
app.use(cookieParser())
app.set("trust proxy",1)
app.use(cors({
    origin: envVars.FRONT_END_URL,
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
    res.json(200).send({ success: true, message: "user auth server running...✔" })
})

app.use(globalErrorHandler)

export default app