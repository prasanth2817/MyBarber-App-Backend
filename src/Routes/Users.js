import express from "express";
import UserController from "../Controllers/Users.js"

const router= express.Router();
router.use("/register",UserController.createUser)
router.use("/login",UserController.Login)
router.use("/logout", UserController.Logout);
router.use("/forget-password",UserController.forgotPassword)
router.use("/reset-passsword",UserController.resetPassword)
router.use("/favorites/add/:id",UserController.addToFavorites)
router.use("/favorites/remove/:id",UserController.removeFromFavorites)
router.use("/favorites/:id",UserController.getUserFavorites)

export default router