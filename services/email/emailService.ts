import { emailConfig, twilioConfig } from '@/config/email.config';
import { EmailTemplates } from './templates';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export class EmailService {
  private transporter = emailConfig.transporter;

  async sendVerificationEmail(
    email: string,
    verificationCode: string,
    name: string,
  ) {
    console.log("[EMAIL] Attempting to send verification email:", {
      to: email,
      code: verificationCode,
      name
    });

    const mailOptions = {
      ...emailConfig.defaults,
      to: email,
      subject: 'Verify your email address',
      html: EmailTemplates.verificationEmail(name, verificationCode),
    };

    try {
      console.log("[EMAIL] Mail options:", {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const result = await this.transporter.sendMail(mailOptions);
      console.log("[EMAIL] Email sent successfully:", result);
      return { success: true };
    } catch (error) {
      console.error('[EMAIL] Failed to send verification email:', error);
      console.error('[EMAIL] SMTP Configuration:', {
        service: 'gmail',
        user: process.env.GMAIL_USER,
        hasPassword: !!process.env.GMAIL_APP_PASSWORD
      });
      return { error: 'Failed to send verification email' };
    }
  }
}

export const sendVerificationEmail = async (email: string, verificationCode: string, name: string) => {
  console.log("[EMAIL] Service called with:", {
    email,
    code: verificationCode,
    name
  });
  const emailService = new EmailService();
  return emailService.sendVerificationEmail(email, verificationCode, name);
};


export async function sendVerificationSMS(phone: string, code: string) {
  if (!process.env.TWILIO_PHONE_NUMBER) {
    throw new Error("TWILIO_PHONE_NUMBER is not configured");
  }

  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${code}`,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER
    });
  } catch (error) {
    console.error("Failed to send SMS:", error);
    throw new Error("Failed to send verification SMS");
  }
}
