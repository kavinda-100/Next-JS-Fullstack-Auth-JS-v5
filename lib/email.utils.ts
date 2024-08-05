import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import VerifyEmail from "@/lib/VerifyEmail";

const MY_EMAIL = process.env.MY_EMAIL as string
const MY_EMAIL_PASSWORD = process.env.APP_PASSWORD as string


export const sendVerificationEmail = async (email: string, token: string, name: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: MY_EMAIL,
            pass: MY_EMAIL_PASSWORD,
        },
    });

    const emailHtml = render(VerifyEmail({ token, name }));

    const options = {
        from: MY_EMAIL,
        to: email,
        subject: "Verify your email address",
        html: emailHtml,
    };

    try {
        await transporter.sendMail(options);
        return true;
    } catch (error: any) {
        return false;
    }
}