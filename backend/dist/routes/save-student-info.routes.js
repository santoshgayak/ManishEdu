import { Router } from "express";
import { saveStudentInfo } from "../controllers/save-student-info.controller.js";
const router = Router();
router.post('/', saveStudentInfo);
export default router;
//# sourceMappingURL=save-student-info.routes.js.map