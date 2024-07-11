import express from "express";
import UserRoutes from "./Users.js"
import BusinessRoutes from "./BusinessUsers.js"
import StoreRoutes from "./Stores.js"
import ServiceRoutes from "./Services.js";
import AppointmentsRoutes from "./Appointments.js";

const router= express.Router();

router.use("/users",UserRoutes)
router.use("/stores",StoreRoutes)
router.use("/services",ServiceRoutes)
router.use("/appointments",AppointmentsRoutes)
router.use("/business-users",BusinessRoutes)

export default router