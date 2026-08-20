import { SaveStudentInfoService } from "../services/save-student-info.service.js";
import { Request, Response } from "express";

const service = new SaveStudentInfoService();

export const saveStudentInfo = async (req: Request, res: Response) => {
  try {
    console.log(" CONTROLLER for student info  HIT");
    console.log(req.body);

    const result = await service.savedToDb(req.body);
    return res.json({
      success: true,
      message: "Saved successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Error:", err);

    return res.status(500).json({
      success: false,
      error: err,
    });
  }
};
