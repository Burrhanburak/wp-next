export class EmailTemplates {
    static verificationEmail(name: string, verificationCode: string): string {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Hi ${name},
          </p>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            Thank you for registering! Please use the following code to verify your email address:
          </p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #333; letter-spacing: 5px; font-size: 32px; margin: 0;">${verificationCode}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">
            This code will expire in 24 hours. If you did not request this verification, please ignore this email.
          </p>
          <div style="margin-top: 30px; text-align: center; color: #999; font-size: 12px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `;
    }
  }