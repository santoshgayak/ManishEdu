import type { Request, Response } from "express";
import { ChangePasswordService } from "../services/change-password.service.js";
import { error } from "node:console";
export const changePassword = async (req: Request, res: Response) => {
  const changePasswordService = new ChangePasswordService();
  const { id, oldPassword, newPassword } = req.body;
  console.log(
    "Hit controller of change password:",
    id,
    oldPassword,
    newPassword,
  );
  try {
    const result = await changePasswordService.changePassword(
      id,
      oldPassword,
      newPassword,
    );
    res.status(200).json({
      success: true,
      message: "Password  changed Successfully.",
    });
  } catch (err) {
    console.error("Error while changing password", err);
  }
  return null;
};
