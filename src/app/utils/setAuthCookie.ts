import { Response } from "express"
import { envVars } from "../config/env"

interface AuthToken {
    accessToken?: string,
    refreshToken?: string
}
export const setAuthCookie = (res: Response, tokens: AuthToken) => {
    if (tokens.accessToken) {
        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: envVars.NODE_ENV == "production",
            sameSite: "none"
        })
    }
    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            secure: envVars.NODE_ENV == "production",
            sameSite: "none"
        })
    }
}
