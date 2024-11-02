import express from "express";
import AppointmentController from "../Controllers/Appointments.js"

const router = express.Router();

router.post("/create", AppointmentController.createAppointment);
router.put('/status/:id', AppointmentController.updateAppointmentStatus);
router.get('/:userId/confirmed', AppointmentController.getConfirmedAppointmentsByUser);
router.get("/store/:id",AppointmentController.getAppointmentByStores)
router.get("/user/:id",AppointmentController.getAppointmentByUser)
router.put("/:appointmentId",AppointmentController.editAppointment)
router.delete("/:appointmentId",AppointmentController.deleteAppointment)

export default router