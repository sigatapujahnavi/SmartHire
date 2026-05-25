import fetch from 'node-fetch'

export const sendOTPEmail = async (email, fullName, otp) => {
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'SmartHire', email: 'janupotti24@gmail.com' },
      to: [{ email, name: fullName }],
      subject: 'Your SmartHire Verification OTP',
      htmlContent: `
        <div style="font-family: Inter, sans-serif; background: #0A0F1E; padding: 40px; border-radius: 12px; max-width: 500px;">
          <h1 style="color: #00D4AA;">Welcome to SmartHire! 🚀</h1>
          <p style="color: #94A3B8;">Hi ${fullName}, use this OTP to verify your account:</p>
          <div style="background: #111827; border: 1px solid #00D4AA; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #ffffff; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h2>
          </div>
          <p style="color: #94A3B8; font-size: 13px;">This OTP expires in 10 minutes. Do not share it with anyone.</p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to send email')
  }
}