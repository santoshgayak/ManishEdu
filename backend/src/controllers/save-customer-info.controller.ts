import { Request, Response } from "express";
import { SaveCustomerInfoService } from "../services/save-customer-info.service.js";

const service = new SaveCustomerInfoService();

export const saveCustomerInfo = async (req: Request, res: Response) => {
  try {
    console.log(" CONTROLLER HIT");
    console.log(req.body);

const result = await service.savedToDb(req.body);
    return res.json({
      success: true,
      message: "Saved successfully",
      data: result
    });

  } catch (err) {
    console.error("❌ Error:", err);

    return res.status(500).json({
      success: false,
      error: err
    });
  }
};