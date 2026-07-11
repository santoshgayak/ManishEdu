import { Router } from "express";
import { getData } from  '../controllers/data.controller.js'

const router = Router();
router.get('/:collection',getData);
export default router;