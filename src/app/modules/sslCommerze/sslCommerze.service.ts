/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios"
import httpStatus from "http-status-codes"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
import { ISSLCommerz } from "./sslCommerze.interface"
import { Transaction } from "../transaction/transaction.model"
import { PaymentStatus } from "../transaction/transaction.interface"
import { Wallet } from "../wallet/wallet.model"
import mongoose from "mongoose"
import httpStausCode from "http-status-codes"

const sslPaymentInit = async (payload: ISSLCommerz) => {

    try {
        const data = {
            store_id: envVars.SSL.SSL_STORE_ID,
            store_passwd: envVars.SSL.SSL_STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&walletId=${payload.walletId}&status=success`,
            fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&walletId=${payload.walletId}&status=fail`,
            cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&walletId=${payload.walletId}&status=cancel`,
            // ipn_url: envVars.SSL.SSl_i,
            shipping_method: "N/A",
            product_name: "Top Up Money",
            product_category: "N/A",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phone,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        }

        const response = await axios({
            method: "POST",
            url: envVars.SSL.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })

        return response.data;

    } catch (error: any) {
        console.log("Payment Error Occured", error);
        throw new AppError(httpStatus.BAD_REQUEST, error.message)
    }
}

const sslSuccess = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1️⃣ Update transaction status within the session
        const updateTransaction = await Transaction.findOneAndUpdate(
            { ssl_tran_id: query.transactionId },
            { status: PaymentStatus.SUCCESS },
            { session, new: true }
        );
        console.log(updateTransaction)
        if (!updateTransaction)throw new AppError(httpStausCode.NOT_FOUND, "transaction not found")

        // 2️⃣ Update wallet balance within the session
        const wallet = await Wallet.findById(query.walletId).session(session);
        if (!wallet) throw new AppError(httpStausCode.NOT_FOUND, "Wallet not found");

        const amount = Number(query.amount);

        wallet.balance += amount;
        await wallet.save({ session });

        // 3️⃣ Commit transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment processed successfully" };
    } catch (error: any) {
        // 4️⃣ Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error
    }
};
const sslFail = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1️⃣ Update transaction status within the session
        const updateTransaction = await Transaction.findOneAndUpdate(
            { ssl_tran_id: query.transactionId },
            { status: PaymentStatus.FAILED },
            { session, new: true }
        );
        if (!updateTransaction)throw new AppError(httpStausCode.NOT_FOUND, "transaction not found")        

        // 3️⃣ Commit transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment processed successfully" };
    } catch (error: any) {
        // 4️⃣ Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error
    }
};
const sslCancel = async (query: Record<string, string>) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1️⃣ Update transaction status within the session
        const updateTransaction = await Transaction.findOneAndUpdate(
            { ssl_tran_id: query.transactionId },
            { status: PaymentStatus.CANCELED },
            { session, new: true }
        );
        if (!updateTransaction)throw new AppError(httpStausCode.NOT_FOUND, "transaction not found")        

        // 3️⃣ Commit transaction
        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Payment processed successfully" };
    } catch (error: any) {
        // 4️⃣ Abort transaction on error
        await session.abortTransaction();
        session.endSession();
        throw error
    }
};



export const SSLService = {
    sslPaymentInit,
    sslSuccess,
    sslFail,
    sslCancel
}