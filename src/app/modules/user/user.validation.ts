import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z.string()
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).nonempty("required"),
    email: z.string("not a string").email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }).nonempty("required"),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }).nonempty("required"),
    phone: z
        .string("Not a string")
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    address: z
        .string("Not a string")
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional()

})
export const updateUserUserZodSchema = z.object({
    name: z.string("not a string")
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
    
    phone: z
        .string("Not a string")
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    address: z
        .string("Not a string")
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isVerified: z.boolean("isVerified must be true or false").optional(),
    isDeleted: z
        .boolean("isDeleted must be true or false")
        .optional()


})