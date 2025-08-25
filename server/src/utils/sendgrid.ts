import * as sgMail from '@sendgrid/mail';
import { config } from '../config';

sgMail.setApiKey(config.sendgridApiKey);

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
  const msg = {
    to,
    from: config.sendgridFromEmail, // Must be verified with SendGrid
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset.</p><p><a href="${resetUrl}">Reset your password</a></p>`
  };
  await sgMail.send(msg);
}
