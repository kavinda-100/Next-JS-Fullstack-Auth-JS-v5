import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import VerifyEmail from "@/lib/emailsUtils/VerifyEmail";
import ResetPassword from "@/lib/emailsUtils/ResetPassword";
import OTPEmail from "@/lib/emailsUtils/OTP"

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

export const sendPasswordResetEmail = async (email: string, token: string, name: string) => {
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

    const emailHtml = render(ResetPassword({ token, name }));

    const options = {
        from: MY_EMAIL,
        to: email,
        subject: "Reset Your Password",
        html: emailHtml,
    };

    try {
        await transporter.sendMail(options);
        return true;
    } catch (error: any) {
        return false;
    }
}

export const sendTwoFactorConfirmationEmail = async (email: string, OTP: string, name: string) => {
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

    const emailHtml = render(OTPEmail({
        OTP,
        name,
        label: "OTP for your TwoFactor Authentication",
        description : "Use this OTP to confirm your TwoFactor Authentication."
    }));

    const options = {
        from: MY_EMAIL,
        to: email,
        subject: "Yor 2FA OTP",
        html: emailHtml,
    };

    try {
        await transporter.sendMail(options);
        return true;
    } catch (error: any) {
        return false;
    }
}