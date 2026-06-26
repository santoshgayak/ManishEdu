import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
//CREATE TRANSPORTER
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});
//VERIFY THE CONNECTION
async function verifyConnection() {
    try {
        await transporter.verify();
        console.log("Server is ready to take our messages");
    }
    catch (err) {
        console.error("Verification failed:", err);
    }
}
//verify connection
verifyConnection();
export class ContactService {
    async sendMail(name, email, subject, message) {
        try {
            const info = await transporter.sendMail({
                from: 'santosgayak1@gmail.com',
                to: email,
                subject: subject || "User enquiry",
                text: `Name: ${name}\nEmail: ${email}\nSubject:${subject}\nMessage:${message}`,
                html: `
        <h2>New Contact Form Submission From </h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        `,
            });
            console.log("Message sent: %s", info.messageId);
            return {
                success: true,
                messageId: info.messageId,
            };
        }
        catch (err) {
            console.error("Error while sending mail:", err);
            return {
                success: false,
                error: err,
            };
        }
    }
}
//# sourceMappingURL=contact.service.js.map