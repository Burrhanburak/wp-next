import { Twilio } from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  throw new Error('Missing Twilio credentials in environment variables');
}

const client = new Twilio(accountSid, authToken);

export async function sendVerificationSMS(to: string, code: string) {
  try {
    const message = await client.messages.create({
      body: `Your WhatsApp Admin verification code is: ${code}. This code will expire in 10 minutes.`,
      from: fromNumber,
      to: to
    });

    return {
      success: true,
      messageId: message.sid
    };
  } catch (error) {
    console.error('[SMS_SERVICE_ERROR]', error);
    throw error;
  }
}
