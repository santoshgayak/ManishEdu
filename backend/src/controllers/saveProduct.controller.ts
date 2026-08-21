import { Request, Response } from "express";
import { DataService } from "../services/data.service.js";

const dataService = new DataService();

export const saveProduct = async (req: Request, res: Response) => {
  const updatedData = req.body;
  const result = await dataService.saveData("products", updatedData);

  //check the credentials
  if (!result) {
    //else return and send a message
    return res.status(500).json({
      message: "error saving product in Controller layer",
    });
  }

  return res.status(200).json({
    success: true,
    data: result,
  });
};
