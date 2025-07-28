import { Router } from "express";
import { otpController } from "./otp.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { sendOtpSchema, verfyOtpSchema } from "./otpValidation";

const router = Router()

router.post("/send",validateRequest(sendOtpSchema), otpController.sendOtp)
router.post("/verify",validateRequest(verfyOtpSchema), otpController.verifyOtp)

export const otpRoutes = router