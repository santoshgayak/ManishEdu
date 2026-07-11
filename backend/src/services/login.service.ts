import { loginData } from "../model/loginData.model.js";
import bcrypt from "bcrypt";
import { DataService } from "./data.service.js";
import jwt from "jsonwebtoken";
import { getDB } from "../db/mongo.js";

 const dataService  = new DataService();

export class LoginService{
     saltRounds = 10;
     myPlaintextPassword = 's0/\/\P4$$w0rD';
     someOtherPlaintextPassword = 'not_bacon';

    async login(data: loginData){
        const hashedPassword = await bcrypt.hash(data.password, 10);

        
        const user = await dataService.getOne("admins",{email: data.email});
        if(!user){
            return null;
        }
        const passwordMatched = await bcrypt.compare(data.password,user.password);


        if (data.email === user.email && passwordMatched && user.role == "admin"){


            const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "1h"
            }
        );


            return{
                    token: token,
                    user: {
                        id: 100,
                        name: 'Santosh Gayak',
                        role: 'admin'
                    }
                };
            }
        //else return 
        return null;  
    }       
       
}