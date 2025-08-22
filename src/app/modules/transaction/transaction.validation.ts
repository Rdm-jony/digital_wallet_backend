import z from "zod";

export const withDrawSchema = z.object({
    amount: z.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
})
export const toupSchema = z.object({
    amount: z.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
})
export const sendMoneySchema = z.object({
    amount: z.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
    receiverWallet: z.string().nonempty("required"),
})
export const cashInSchema = z.object({
    amount: z.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
    receiverWallet: z.string().nonempty("required"),
})
export const cashOutSchema = z.object({
    amount: z.coerce.number().int().gt(0, { message: "Amount must be greater than 0" }),
    receiverWallet: z.string().nonempty("required"),
})