import express from "express";
import AppointmentController from "../Controllers/Appointments.js"

const router = express.Router();

router.post("/appointments/create", AppointmentController.createAppointment);
router.get("/:id",AppointmentController.getAppointmentByStores)
router.get("/",AppointmentController.getAppointmentByUser)

export default router