import nodemailer from 'nodemailer';

export const emailConfig = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  }),
  defaults: {
    from: {
      name: 'WhatsApp Bulk',
      address: process.env.GMAIL_USER!
    }
  }  
};

export const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  twilioNumber: process.env.TWILIO_NUMBER,
};