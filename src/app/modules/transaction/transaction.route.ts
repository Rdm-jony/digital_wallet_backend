import { Router } from "express";
import { transactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { cashInSchema, cashOutSchema, sendMoneySchema, toupSchema, withDrawSchema } from "./transaction.validation";

const router=Router()

router.post("/topup",checkAuth(Role.USER,Role.AGENT),validateRequest(toupSchema),transactionController.transactionTopup)
router.post("/withdraw",checkAuth(Role.USER,Role.AGENT),validateRequest(withDrawSchema),transactionController.transactionWithdraw)
router.post("/send-money",checkAuth(Role.USER),validateRequest(sendMoneySchema),transactionController.transactionSendMoney)
router.post("/cashIn",checkAuth(Role.AGENT),validateRequest(cashInSchema),transactionController.transactionCashin)
router.post("/cashOut",checkAuth(Role.USER),validateRequest(cashOutSchema),transactionController.transactionCashout)
router.get("/history",checkAuth(Role.USER,Role.AGENT),transactionController.getTransactionHistory)

export const transactionRoutes=router