import { Request, Response } from "express";
import { DataService } from "../services/data.service.js";

const dataService = new DataService();
export const deleteClass = async (req: Request, res: Response) => {
  console.log(" In controller delete");
  const { id } = req.body;
  if (!id) return;
  const result = await dataService.deleteClass("courses", id);
  //check the credentials
  if (!result) {
    //else return and send a message
    return res.status(500).json({
      message: "error deleting class in Controller layer",
    });
  }
  return res.status(200).json({
    success: true,
    data: result,
  });
};
