import { Router } from "express";
import { deleteClass } from "../controllers/deleteClass.controller.js";

const router = Router();
router.post("/", deleteClass);
export default router;
