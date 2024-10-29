import express from "express";
import ServiceController from '../Controllers/Services.js';
import Auth from "../Common/Auth.js"

const router = express.Router();

router.post("/create", Auth.adminGaurd, ServiceController.createService);
router.get("/:storeId", ServiceController.getServicesByStore);
router.put("/:serviceId", Auth.adminGaurd, ServiceController.editService);
router.delete("/:serviceId", Auth.adminGaurd, ServiceController.deleteService);

export default router