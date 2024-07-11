import express from "express";
import AppointmentController from "../Controllers/Appointments.js"

const router = express.Router();

router.post("/create", AppointmentController.createAppointment);
router.get("/store/:appointmentId",AppointmentController.getAppointmentByStores)
router.get("/user/:appointmentId",AppointmentController.getAppointmentByUser)
router.put("/:appointmentId",AppointmentController.editAppointment)
router.delete("/:appointmentId",AppointmentController.deleteAppointment)

export default router