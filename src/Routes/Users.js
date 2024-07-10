import express from "express";
import UserController from "../Controllers/Users.js"

const router= express.Router();
router.use("/sign-up",UserController.createUser)
router.use("/sign-in",UserController.Login)
router.use("/forget-password",UserController.forgotPassword)
router.use("/reset-passsword",UserController.resetPassword)

export default router