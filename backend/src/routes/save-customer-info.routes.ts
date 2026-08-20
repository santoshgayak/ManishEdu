import { Router } from "express";
import { saveCustomerInfo } from "../controllers/save-customer-info.controller.js";

const router = Router();

router.post("/", saveCustomerInfo);

export default router;
