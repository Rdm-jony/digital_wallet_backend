import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { SSLService } from "./sslCommerze.service"
import { envVars } from "../../config/env"

const  sslSuccess = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await SSLService.sslSuccess(query)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}&walletId=${query.walletId}`)
    }
})
const  sslFail = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await SSLService.sslFail(query)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}&walletId=${query.walletId}`)
    }
})
const  sslCancel = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as Record<string, string>
    const result = await SSLService.sslCancel(query)

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}&walletId=${query.walletId}`)
    }
})

 export const SSLController={
    sslSuccess,
    sslFail,
    sslCancel
}