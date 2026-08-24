import { loginData } from "../model/loginData.model.js";
import bcrypt from "bcrypt";
import { DataService } from "./data.service.js";
import jwt from "jsonwebtoken";
import { getDB } from "../db/mongo.js";
import { hasSubscribers } from "node:diagnostics_channel";

const dataService = new DataService();

export class LoginService {
  saltRounds = 10;
  myPlaintextPassword = "s0/\/\P4$$w0rD";
  someOtherPlaintextPassword = "not_bacon";

  async login(data: loginData) {
    const user = await dataService.getOne("admins", { email: data.email });

    if (!user) {
      return null;
    }
    const passwordMatched = await bcrypt.compare(data.password, user.password);

    if (
      data.email === user.email &&
      passwordMatched &&
      user.role == "Senior Administrator"
    ) {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "1h",
        },
      );
      const { password, ...userWithoutPassword } = user;
      console.log("Hello P", userWithoutPassword);

      return {
        token: token,
        user: userWithoutPassword,
      };
    }
    //else return
    return null;
  }
}
