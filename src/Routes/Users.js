import express from "express";
import UserController from "../Controllers/Users.js";

const router = express.Router();

// User registration and authentication routes
router.post("/register", UserController.createUser);
router.post("/login", UserController.Login);
router.post("/logout", UserController.Logout);

// Password management routes
router.post("/forget-password", UserController.forgotPassword);
router.post("/reset-password", UserController.resetPassword);

// Favorites management routes
router.put("/favorites/add/:id", UserController.addToFavorites);
router.delete("/favorites/remove/:id", UserController.removeFromFavorites);
router.get("/favorites/:id", UserController.getUserFavorites);

// User profile update route
router.put("/:id", UserController.updateUser);

export default router;
