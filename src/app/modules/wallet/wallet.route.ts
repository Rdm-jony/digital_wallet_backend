import { Router } from "express";
import { walletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router=Router()

router.get("/me",checkAuth(Role.USER,Role.AGENT), walletController.getWallet)

export const walletRoutes=router