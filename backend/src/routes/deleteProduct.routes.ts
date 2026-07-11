import { Router } from "express";
import { deleteProduct} from "../controllers/deleteProduct.controller.js";

const router = Router();
router.post('/',deleteProduct);
export default router;