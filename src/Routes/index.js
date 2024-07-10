import express from "express";
import UserRoutes from "./Users.js"
import StoreRoutes from "./Stores.js"
import ServiceRoutes from "./Services.js";

const router= express.Router();

router.use("/user",UserRoutes)
router.use("/store",StoreRoutes)
router.use("/service",ServiceRoutes)

export default router