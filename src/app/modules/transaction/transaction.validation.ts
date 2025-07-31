import z from "zod";

export const withDrawSchema = z.object({
    amount: z.number().int().gt(0)
})
export const toupSchema = z.object({
    amount: z.number().int().gt(0)
})
export const sendMoneySchema = z.object({
    amount: z.number().int().gt(0),
    receiverWallet: z.string().nonempty("required"),
})
export const cashInSchema = z.object({
    amount: z.number().int().gt(0),
    receiverWallet: z.string().nonempty("required"),
})
export const cashOutSchema = z.object({
    amount: z.number().int().gt(0),
    receiverWallet: z.string().nonempty("required"),
})