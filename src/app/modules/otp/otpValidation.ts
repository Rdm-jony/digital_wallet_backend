import z from "zod";

export const sendOtpSchema = z.object({
    name: z.string().nonempty("required"),
    email: z.email().nonempty("required")
})
export const verfyOtpSchema = z.object({
    email: z.email().nonempty("required"),
    otp: z.string().nonempty("required")
})