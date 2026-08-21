import type { Request, Response } from "express";
import { ContactService } from "../services/contact.service.js";
import { error } from "node:console";

//create instant of contact service
const contactService = new ContactService();

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    const result = await contactService.sendMail(name, email, subject, message);
    res.status(200).json({
      success: true,
      message: "Contact Form Submitted Successfully.",
      emailResult: result,
    });
  } catch (err) {
    console.error("error while sending emaillCCT", err);
    res.status(500).json({
      success: false,
      message: "Contact Form failed submission!",
      error,
    });
  }
};
