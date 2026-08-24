import { Request, Response } from "express";
import { DataService } from "../services/data.service.js";

const dataService = new DataService();

export const updatedAdmin = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const id = req.params.id;
  const updatedData = req.body;

  const result = await dataService.updateFields("admins", id, updatedData);

  if (!result) {
    return res.status(500).json({
      message: "Error updating admin",
    });
  }
  return res.status(200).json({
    success: true,
    admin: result,
  });
};
