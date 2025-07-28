import { Response } from "express"

interface ResponseData<T> {
    success: boolean,
    message: string,
    statusCode: number,
    data: T[] | T,
}
export const sendResponse = <T>(res: Response, data: ResponseData<T>) => {
    return res.status(data.statusCode).json({
        data:data.data,
        message:data.message,
        statusCode:data.statusCode,
        success:data.success
    })
}