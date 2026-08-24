import { Router } from "express";
import { updatedAdmin } from "../controllers/updateAdmin.controller.js";

const router = Router();
router.patch("/:id", updatedAdmin);
export default router;
