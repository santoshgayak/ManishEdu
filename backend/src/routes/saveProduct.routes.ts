 import { Router } from "express";
 import { saveProduct } from '../controllers/saveProduct.controller.js'
const router = Router();

router.post('/', saveProduct);

export default router;