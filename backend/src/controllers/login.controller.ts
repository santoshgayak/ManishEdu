import { Request, Response } from "express";
import { LoginService } from "../services/login.service.js";

const loginService = new LoginService();
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = { email, password };

  const result = await loginService.login(data);

  //check the credentials
  if (!result) {
    //else return and send a message
    return res.status(401).json({
      message: "invalid credentials..try again!",
    });
  }

  console.log("REsult:", result);
  return res.json(result);
};
