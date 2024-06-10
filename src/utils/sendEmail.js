import nodemailer from 'nodemailer'
import { configObject } from '../config/connectDB.js'

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    }
})

const sendMail = async ({ service = '', to = 'example@example.com', subject = '', html = '' }) => await transport.sendMail({
    from: `${service} ${configObject.gmail_user}`,
    to,
    subject,
    html,
})

export default sendMail