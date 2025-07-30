import { Router } from "express";
import { transactionController } from "./transaction.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router=Router()

router.post("/create",checkAuth(Role.USER,Role.AGENT),transactionController.addTransaction)

export const transactionRoutes=router