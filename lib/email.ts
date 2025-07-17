import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import { env } from "./env";
import { otpRateLimiter, createRateLimitKey } from "./rate-limit";

// Singleton transporter instance
let transporter: nodemailer.Transporter | null = null;

// Create transporter with optimized configuration
function createTransporter() {
  const transportOptions: SMTPTransport.Options = {
    host: env.EMAIL_SERVER_HOST,
    port: parseInt(env.EMAIL_SERVER_PORT),
    secure: true, // Always use SSL/TLS for port 465
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
    // Optimized timeout settings
    connectionTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    socketTimeout: 60000, // 60 seconds
    // Additional security options
    requireTLS: true,
    tls: {
      rejectUnauthorized: true,
    },
  };

  return nodemailer.createTransport(transportOptions);
}

// Get or create transporter instance
export function getEmailTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

// Professional OTP email template
export function createOTPEmailTemplate(otp: string, email: string) {
  return {
    subject: "InulPRO - Kode Verifikasi Email Anda",
    html: `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Email - InulPRO</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">InulPRO</h1>
            <p style="color: #e8e8e8; margin: 10px 0 0 0; font-size: 16px;">Verifikasi Email Anda</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Kode Verifikasi Anda</h2>
            
            <p style="color: #666666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">
              Halo! Kami telah menerima permintaan untuk masuk ke akun InulPRO Anda. 
              Gunakan kode verifikasi berikut untuk melanjutkan:
            </p>
            
            <!-- OTP Code -->
            <div style="background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <div style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </div>
              <p style="color: #888888; margin: 15px 0 0 0; font-size: 14px;">
                Kode ini berlaku selama 10 menit
              </p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 30px 0; border-radius: 4px;">
              <p style="color: #856404; margin: 0; font-size: 14px; line-height: 1.5;">
                <strong>Penting:</strong> Jangan bagikan kode ini kepada siapa pun. Tim InulPRO tidak akan pernah meminta kode verifikasi Anda.
              </p>
            </div>
            
            <p style="color: #666666; line-height: 1.6; margin: 30px 0 0 0; font-size: 14px;">
              Jika Anda tidak meminta kode ini, abaikan email ini. Akun Anda tetap aman.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #888888; margin: 0; font-size: 14px;">
              Email ini dikirim ke <strong>${email}</strong>
            </p>
            <p style="color: #888888; margin: 10px 0 0 0; font-size: 12px;">
              © ${new Date().getFullYear()} InulPRO. Semua hak dilindungi.
            </p>
          </div>
          
        </div>
      </body>
      </html>
    `,
    text: `
InulPRO - Kode Verifikasi Email

Halo!

Kode verifikasi Anda: ${otp}

Kode ini berlaku selama 10 menit.

Jangan bagikan kode ini kepada siapa pun.
Jika Anda tidak meminta kode ini, abaikan email ini.

Email ini dikirim ke ${email}

© ${new Date().getFullYear()} InulPRO
    `.trim(),
  };
}

// Send OTP email with retry mechanism and rate limiting
export async function sendOTPEmail(
  email: string,
  otp: string,
  retries = 3
): Promise<void> {
  // Check rate limiting first
  const rateLimitKey = createRateLimitKey(email);
  const rateLimitResult = otpRateLimiter.isAllowed(rateLimitKey);

  if (!rateLimitResult.allowed) {
    throw new Error(rateLimitResult.message || "Rate limit exceeded");
  }

  const transporter = getEmailTransporter();
  const template = createOTPEmailTemplate(otp, email);

  const mailOptions = {
    from: {
      name: "InulPRO",
      address: env.EMAIL_SERVER_USER,
    },
    to: email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    // Email headers for better deliverability
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
      Importance: "high",
    },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(
        `OTP email sent successfully to ${email} (attempt ${attempt})`
      );
      return;
    } catch (error) {
      console.error(
        `Attempt ${attempt} failed to send OTP email to ${email}:`,
        error
      );

      if (attempt === retries) {
        throw new Error(
          `Failed to send OTP email after ${retries} attempts: ${error}`
        );
      }

      // Wait before retry (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}

// Cleanup transporter on app shutdown
export function closeEmailTransporter() {
  if (transporter) {
    transporter.close();
    transporter = null;
  }
}
