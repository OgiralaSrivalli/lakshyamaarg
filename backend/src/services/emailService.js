// Email service using Nodemailer + Gmail SMTP
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP verification email
 * @param {string} toEmail - recipient email
 * @param {string} name    - recipient name
 * @param {string} otp     - 6-digit OTP
 */
const sendOtpEmail = async (contact, name, otp) => {
  if (!contact.includes('@')) {
    console.log(`\n\n📱 [SMS SIMULATION] SMS Sent to Phone Number: ${contact}`);
    console.log(`📱 [SMS SIMULATION] Message: "Your Lakshyamaarg OTP is ${otp}. Expires in 10 minutes."\n\n`);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: contact,
    subject: '🎯 Your Lakshyamaarg Verification Code',
    html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8"/>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #f1f5f9; margin: 0; padding: 0; }
            .wrapper { max-width: 520px; margin: 40px auto; background: #13131f; border: 1px solid rgba(99,102,241,0.25); border-radius: 20px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center; }
            .header h1 { margin: 0; font-size: 26px; color: white; }
            .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
            .body { padding: 36px; }
            .body p { color: #94a3b8; font-size: 15px; line-height: 1.7; margin: 0 0 20px; }
            .otp-box { text-align: center; margin: 28px 0; padding: 24px; background: rgba(99,102,241,0.12); border: 2px dashed rgba(99,102,241,0.4); border-radius: 16px; }
            .otp-box .otp { font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #a5b4fc; font-family: monospace; }
            .otp-box .expire { font-size: 13px; color: #64748b; margin-top: 10px; }
            .footer { text-align: center; padding: 20px 36px; border-top: 1px solid rgba(255,255,255,0.06); color: #475569; font-size: 12px; }
            .footer a { color: #6366f1; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>⚡ Lakshyamaarg</h1>
              <p>AI Career Intelligence Platform</p>
            </div>
            <div class="body">
              <p>Hi <strong style="color:#f1f5f9">${name}</strong>,</p>
              <p>Welcome to Lakshyamaarg! Use the OTP below to verify your email address and activate your account.</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
                <div class="expire">⏰ This code expires in <strong>10 minutes</strong></div>
              </div>
              <p>If you didn't create an account with us, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2025 Lakshyamaarg &nbsp;|&nbsp; <a href="#">Unsubscribe</a></p>
            </div>
          </div>
        </body>
        </html>
        `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent to ${contact}`);
};

module.exports = { sendOtpEmail };
