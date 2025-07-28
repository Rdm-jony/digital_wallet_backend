import { JwtPayload } from "jsonwebtoken"
import { generateNewAccessTokenByRefreshToken } from "../../utils/createUsersToken"
import { User } from "../user/user.model"
import bcrypt from "bcryptjs"
import AppError from "../../errorHelpers/AppError"
import httpStatusCode from "http-status-codes"
import { envVars } from "../../config/env"
import { IAuthProvider, IsActive } from "../user/user.interface"
import { generateToken } from "../../utils/jwt"
import { sendMail } from "../../utils/sendMail"

const getNewAccessToken = async (refreshToken: string) => {
    const accessToken = await generateNewAccessTokenByRefreshToken(refreshToken)
    return {
        accessToken
    }
}

const changePassword = async (newPassword: string, oldPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId)
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User not found");

    }
    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user?.password as string)

    if (!isOldPasswordMatch) {
        throw new AppError(httpStatusCode.UNAUTHORIZED, "Old Password does not match");
    }

    user.password = bcrypt.hashSync(newPassword, Number(envVars.BCRYPT_SALT))

    await user?.save()
}

const setPassword = async (plainPassword: string, userId: string) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new AppError(httpStatusCode.NOT_FOUND, "User not found");

    }

    if (user.password && user.auth.some(providerObj => providerObj.provider == "google")) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashNewPassword = await bcrypt.hash(plainPassword, Number(envVars.BCRYPT_SALT))

    user.password = hashNewPassword

    const newAuth: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    user.auth = [...user.auth, newAuth]

    await user.save()
}

const forgetPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email })
    if (!isUserExist) {
        throw new AppError(httpStatusCode.NOT_FOUND, "user not found")
    }

    if (!isUserExist.isVerified) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatusCode.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatusCode.BAD_REQUEST, "User is deleted")
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const resetToken = generateToken(jwtPayload, envVars.JWT_ACCESS_TOKEN_SECRET, "10m")
    const resetUiLink = `${envVars.FRONT_END_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    await sendMail({
        to: isUserExist.email,
        subject: "Reset Password",
        templateName: 'forgetPassword',
        templateData: {
            name: isUserExist.name,
            resetUiLink
        }
    })
}

const resetPassword = async (payload: { id: string, newPassword: string }, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }
    isUserExist.password = await bcrypt.hash(payload.newPassword, Number(envVars.BCRYPT_SALT))
    await isUserExist.save()
}
export const authService = {
    getNewAccessToken,
    changePassword,
    setPassword,
    forgetPassword,
    resetPassword
}