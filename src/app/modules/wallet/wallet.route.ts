import { Router } from "express";
import { walletController } from "./wallet.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router()

router.get("/me", checkAuth(Role.USER, Role.AGENT), walletController.getWallet)
router.patch("/block/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletController.blocktWallet)
router.patch("/unblock/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), walletController.unblocktWallet)

export const walletRoutes = router