import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { statController } from "./stat.controller";

const router = Router()

router.get("/transaction/me", checkAuth(Role.USER, Role.AGENT), statController.getTransactionStat)
router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    statController.getUserStats
);

export const statRoutes = router