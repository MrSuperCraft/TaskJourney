import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { db } from '../../firebase'; // Adjust the path to your Firebase configuration
import { doc, setDoc } from 'firebase/firestore';

import emailTemplate from './emailTemplate';
import path from 'path';
// Function to generate a 6-digit code
const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();
        console.log(email);

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
        }

        const verificationCode = generateCode();

        // Store the code in Firestore with an expiration time
        const codeExpiration = new Date();
        codeExpiration.setHours(codeExpiration.getHours() + 1); // Code valid for 1 hour
        await setDoc(doc(db, 'emailVerificationCodes', email), {
            code: verificationCode,
            expiresAt: codeExpiration,
        });



        // Create a transporter using MailerSend SMTP settings
        const transporter = nodemailer.createTransport({
            host: "smtp.mailersend.net",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.NEXT_PUBLIC_SMTP, // generated MailerSend user
                pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD, // generated MailerSend password
            },
            tls: {
                rejectUnauthorized: false
            }
        });



        const mailOptions = {
            from: `MrSuperCraft from TaskJourney <${process.env.NEXT_PUBLIC_SMTP}>`,
            to: email,
            subject: 'Email Verification - TaskJourney',
            html: emailTemplate(email, verificationCode),
            attachments: [
                {
                    filename: 'tasks-solid.png',
                    path: path.join(process.cwd(), 'public', 'tasks-solid.png'),
                    cid: 'tasks-solid.png',
                },
                {
                    filename: 'circle-check-solid.png',
                    path: path.join(process.cwd(), 'public', 'circle-check-solid.png'),
                    cid: 'circle-check-solid.png',
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        return new Response(JSON.stringify({ message: 'Verification email sent' }), { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ error: 'Error sending verification email' }), { status: 500 });
    }
}