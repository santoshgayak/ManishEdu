import { Request, Response } from "express";
import { LoginService } from "../services/login.service.js";


const loginService = new LoginService();
export const login = async(req:Request, res:Response )=>{
    const { email, password } = req.body;
    console.log("body:",req.body);
    console.log("Email:", email);
    console.log("password:",password);
    const data = {email,password}
    
    const result = await loginService.login(data);

    //check the credentials
    if (!result){
         //else return and send a message
        return res.status(401).json({
        message:'invalid credentials..try again!'

        });
    }


    return res.json(result);
    
}
