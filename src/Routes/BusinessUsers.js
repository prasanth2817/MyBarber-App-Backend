import express from "express";
import BusinessUserController from "../Controllers/BusinessUsers.js"

const router = express.Router();

router.use("/register", BusinessUserController.createBusinessUser)
router.use("/login", BusinessUserController.Login)
router.use("/forget-password", BusinessUserController.forgotPassword)
router.use("/reset-passsword", BusinessUserController.resetPassword)

export default router