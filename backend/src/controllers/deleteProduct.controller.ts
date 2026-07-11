import { Request, Response } from "express";
import { DataService } from "../services/data.service.js";

const dataService = new DataService();
export  const deleteProduct  = async(req:Request, res:Response)=> {
    console.log(" In controller delete");
     const {id} = req.body;

     if(!id){
    return res.status(400).json({
        success:false,
        message:"Product ID missing"
    });
}
    const result = await dataService.deleteProduct('products',id);
    //check the credentials
    if (!result){
         //else return and send a message
        return res.status(500).json({
        message:'error deleting product in Controller layer'
        });
    }
        return res.status(200).json({
            success: true,
            data: result
        });
}