// server/services/emailService.js
import nodemailer from 'nodemailer'

export const sendOTPEmail = async (email, fullName, otp) => {
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

  await transporter.sendMail({
    from: `"SmartHire" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your SmartHire Verification OTP',
    html: `
      <div style="font-family: Inter, sans-serif; background: #0A0F1E; padding: 40px; border-radius: 12px; max-width: 500px;">
        <h1 style="color: #00D4AA;">Welcome to SmartHire! 🚀</h1>
        <p style="color: #94A3B8;">Hi ${fullName}, use this OTP to verify your account:</p>
        <div style="background: #111827; border: 1px solid #00D4AA; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <h2 style="color: #ffffff; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #94A3B8; font-size: 13px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `,
  })
}