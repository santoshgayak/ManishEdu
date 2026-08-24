import { changePassword } from "../controllers/changePassword.controller.js";
import { getDB } from "../db/mongo.js";
import { Admin } from "../model/admin.model.js";
import bcrypt from "bcrypt";

export class ChangePasswordService {
  async changePassword(id: string, oldPassword: string, newPassword: string) {
    const db = getDB();

    //get the admin user
    const result = await db.collection<Admin>("admins").findOne({ _id: id });
    if (!result) {
      return {
        success: false,
        message: "user not found",
      };
    }
    //check if the recieved old password match with db password
    const passwordMatched = await bcrypt.compare(oldPassword, result?.password);
    if (!passwordMatched) {
      return {
        success: false,
        message: "Current password is incorrect",
      };
    }

    //update the password field after hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateResult = await db.collection<Admin>("admins").updateOne(
      { _id: id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
    );

    //if matchcount is 1, return success true
    if (updateResult.matchedCount === 1) {
      return {
        success: true,
        message: "Password changed successfully.",
      };
    }

    //password failed to update then
    return {
      success: false,
      message: "Password update failed.",
    };
  }
}
