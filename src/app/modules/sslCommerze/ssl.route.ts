import { Router } from "express";
import { SSLController } from "./ssl.controller";

const router=Router()

router.post("/success",SSLController.sslSuccess)
router.post("/fail",SSLController.sslFail)
router.post("/cancel",SSLController.sslCancel)

export const sslRoutes=router