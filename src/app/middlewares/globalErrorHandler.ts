/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { envVars } from "../config/env"
import { handleZodError } from "../errorHelpers/handleZodeError"
import { TErrorSources } from "../interfaces/error.types"
import { hendleCastError } from "../errorHelpers/handleCastError"
import { handleDuplicateError } from "../errorHelpers/handleDuplicateError"
import { handlerValidationError } from "../errorHelpers/handleValidationError"
import { deleteImageFromCloudinary } from "../config/cloudinary.config"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandler =async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV == "development") {
        console.log(err)
    }
    if(req.file?.path){
        await deleteImageFromCloudinary(req.file?.path)
    }
    let statusCode = 500
    let message = "something went wrong"
    let errorSources: TErrorSources[] = []
    if (err.code == 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    if (err.name == "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    if (err.name == "CastError") {
        const simplifiedError = hendleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    else if (err.name === 'ZodError') {
        const simplifiedError = handleZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    else if (err instanceof Error) {
        message = err.message
    } else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err,
        stack: envVars.NODE_ENV == "development" ? err.stack : null
    })
}