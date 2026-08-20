import { Router } from "express";
import { saveClass } from "../controllers/saveClass.controller.js";
const router = Router();

router.post("/", saveClass);

export default router;
