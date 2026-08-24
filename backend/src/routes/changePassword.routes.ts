import { Router } from "express";
import { changePassword } from "../controllers/changePassword.controller.js";

const router = Router();
router.patch("/", changePassword);
export default router;
