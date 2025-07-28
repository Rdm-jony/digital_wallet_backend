/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "path"
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";


const transporter = nodemailer.createTransport({
    host: envVars.MAIL_SENDER.SMTP_HOST,
    port: Number(envVars.MAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.MAIL_SENDER.SMTP_USER,
        pass: envVars.MAIL_SENDER.SMTP_PASS
    }
})

interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData: Record<string, unknown>,
    
}

export const sendMail = async ({
    to,
    subject,
    templateName,
    templateData
}: SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `ejsTemplate/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVars.MAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html
        })
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);

    } catch (error: any) {
        throw new AppError(401, error.message)
    }
}