const nodemailer = require('nodemailer');

module.exports = async ({ to, subject, html }) => {
  try {
    // Validate environment variables
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error(
        'Gmail credentials not configured in environment variables',
      );
    }

    console.log(`[EMAIL] Setting up Gmail SMTP for ${to}`);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL instead of STARTTLS
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      connectionTimeout: 30000,
      socketTimeout: 30000,
      debug: true,
      logger: true,
    });

    console.log('[EMAIL] Verifying SMTP connection...');

    // Verify connection before sending
    await transporter.verify();
    console.log('[EMAIL] SMTP connection verified successfully');

    console.log(`[EMAIL] Sending email to ${to}...`);

    const result = await transporter.sendMail({
      from: `"School Parking System" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(
      `[EMAIL] ✅ Successfully sent to ${to}. Message ID: ${result.messageId}`,
    );
    console.log(`[EMAIL] Response:`, result.response);

    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] ❌ Failed to send to ${to}:`, error.message);
    console.error('[EMAIL ERROR] Full error details:', error);

    // More detailed error logging
    if (error.code) {
      console.error('[EMAIL ERROR] Error code:', error.code);
    }
    if (error.response) {
      console.error('[EMAIL ERROR] SMTP response:', error.response);
    }
    if (error.command) {
      console.error('[EMAIL ERROR] SMTP command:', error.command);
    }

    throw error;
  }
};
