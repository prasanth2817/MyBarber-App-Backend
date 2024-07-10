import express from "express";
import ServiceController from '../Controllers/Services.js';
import Auth from "../Common/Auth.js"

const router = express.Router();

router.post("/create", Auth.adminGaurd, ServiceController.createService);
router.get("/:id", ServiceController.getServicesByStore);
router.put("/:id",ServiceController.editService);
router.delete("/:id",ServiceController.deleteService);

export default router