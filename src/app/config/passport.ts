/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { User } from "../modules/user/user.model";
import brcypt from "bcryptjs"
import { envVars } from "./env";
import { IAuthProvider, IsActive } from "../modules/user/user.interface";
import AppError from "../errorHelpers/AppError";
import httpStatusCode from "http-status-codes"

// Local Strategy
passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email });
            if (!isUserExist) {
                return done("User does not exist")
            }
            if (!isUserExist.isVerified) {
                throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified")

            }

            if (isUserExist.isActive !== IsActive.ACTIVE) {
                throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActive}`)

            }

            if (isUserExist.isDeleted) {
                throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted")

            }
            const isPasswordCorrect = await brcypt.compare(password, isUserExist.password as string);
            if (!isPasswordCorrect) {
                return done("Invalid email or password.");
            }
            const user=isUserExist.toObject()
            delete user.password

            return done(null, user)
        } catch (error) {
            return done(error)
        }

    })
)

// Google Strategy
passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value
            if (!email) {
                return done(null, false, { mesaage: "No email found" })
            }
            let isUserExist = await User.findOne({ email })


            if (!isUserExist) {
                const authProvider: IAuthProvider = {
                    provider: "google",
                    providerId: profile.id
                }
                isUserExist = await User.create({
                    email: email,
                    name: profile?.displayName,
                    auth: [authProvider],
                    isVerified: true,
                    picture: profile.photos?.[0].value
                })
            }
            if (!isUserExist.isVerified) {
                throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified")

            }

            if (isUserExist.isActive !== IsActive.ACTIVE) {
                throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActive}`)

            }

            if (isUserExist.isDeleted) {
                throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted")

            }

            return done(null, isUserExist)
        } catch (error) {
            return done(error)
        }
    })
)


// Serialize user for session
passport.serializeUser((user: any, done: any) => {
    done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});