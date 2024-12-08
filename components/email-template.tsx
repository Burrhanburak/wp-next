import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  verificationUrl?: string;
  type: 'welcome' | 'verification' | 'reset-password';
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  verificationUrl,
  type,
}) => {
  const templates = {
    welcome: (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Welcome to WhatsApp Bulk, {firstName}!</h1>
        <p style={{ color: '#666', lineHeight: '1.5' }}>Thank you for joining our platform. We're excited to have you on board!</p>
        <p style={{ color: '#666', lineHeight: '1.5' }}>With WhatsApp Bulk, you can:</p>
        <ul style={{ color: '#666', lineHeight: '1.5' }}>
          <li>Send bulk messages efficiently</li>
          <li>Manage your contacts</li>
          <li>Track message delivery</li>
          <li>And much more!</li>
        </ul>
        <p style={{ color: '#666', lineHeight: '1.5' }}>If you have any questions, feel free to reach out to our support team.</p>
      </div>
    ),
    verification: (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Verify your email, {firstName}</h1>
        <p style={{ color: '#666', lineHeight: '1.5' }}>Your verification code is:</p>
        <div style={{
          background: '#f4f4f4',
          padding: '24px',
          borderRadius: '8px',
          marginTop: '16px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '32px',
            fontWeight: 'bold',
            letterSpacing: '8px',
            color: '#333',
          }}>
            {verificationUrl}
          </span>
        </div>
        <p style={{ color: '#666', lineHeight: '1.5' }}>Enter this code in the verification page to verify your email address.</p>
        <p style={{ color: '#666', lineHeight: '1.5' }}>This code will expire in 24 hours.</p>
        <p style={{ color: '#666', lineHeight: '1.5', marginTop: '24px' }}>
          If you didn't create an account with us, you can safely ignore this email.
        </p>
      </div>
    ),
    'reset-password': (
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Reset Your Password, {firstName}</h1>
        <p style={{ color: '#666', lineHeight: '1.5' }}>We received a request to reset your password.</p>
        <p style={{ color: '#666', lineHeight: '1.5' }}>Your password reset code is:</p>
        <div style={{
          background: '#f4f4f4',
          padding: '24px',
          borderRadius: '8px',
          marginTop: '16px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: '32px',
            fontWeight: 'bold',
            letterSpacing: '8px',
            color: '#333',
          }}>
            {verificationUrl}
          </span>
        </div>
        <p style={{ color: '#666', lineHeight: '1.5' }}>Enter this code to reset your password.</p>
        <p style={{ color: '#666', lineHeight: '1.5' }}>This code will expire in 1 hour.</p>
        <p style={{ color: '#666', lineHeight: '1.5', marginTop: '24px' }}>
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    ),
  };

  const template = templates[type];
  
  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      margin: '0 auto',
      padding: '20px',
    }}>
      {template}
      <hr style={{ 
        border: 'none',
        borderTop: '1px solid #eee',
        margin: '32px 0',
      }} />
      <footer style={{ 
        color: '#666',
        fontSize: '14px',
        textAlign: 'center',
      }}>
        <p style={{ margin: '5px 0' }}>WhatsApp Bulk Messaging Platform</p>
        <p style={{ margin: '5px 0' }}>This is an automated message, please do not reply.</p>
      </footer>
    </div>
  );
};
