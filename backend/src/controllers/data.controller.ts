import { Request, Response } from "express";
import { DataService } from "../services/data.service.js";
import { collectionList } from "../config/collection-names.js";

export const getData = async (req: Request, res: Response) => {
  const service = new DataService();
  const collection = req.params.collection.toString().toLowerCase();
  console.log(" collecction: ", collection);
  if (!collectionList.includes(collection)) {
    return res.status(400).json({
      success: false,
      message: "Invalid collection",
    });
  }

  try {
    const data = await service.getAll(collection);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Controller data error", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get data",
    });
  }
};
