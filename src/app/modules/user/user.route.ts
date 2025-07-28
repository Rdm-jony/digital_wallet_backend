import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema, updateUserUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";
import { multerUpload } from "../../config/multer.config";

const router = Router()



router.post('/create', multerUpload.single("file"), validateRequest(createUserZodSchema), userController.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUser)
router.get("/get-me", checkAuth(...Object.values(Role)), userController.getMe)
router.get("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getSingleUser)
router.patch("/:id", checkAuth(...Object.values(Role)), multerUpload.single("file"), validateRequest(updateUserUserZodSchema), userController.updateUser)



export const userRoutes = router