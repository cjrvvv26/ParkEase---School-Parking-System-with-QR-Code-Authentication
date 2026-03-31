const nodemailer = require('nodemailer');

module.exports = async ({ to, subject, html }) => {
  try {
    // Validate environment variables
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error(
        'Gmail credentials not configured in environment variables',
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection before sending
    await transporter.verify();
    console.log('[EMAIL] SMTP connection verified');

    const result = await transporter.sendMail({
      from: `"School Parking System" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(
      `[EMAIL] Successfully sent to ${to}. Message ID: ${result.messageId}`,
    );
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${to}: ${error.message}`);
    console.error('[EMAIL ERROR] Stack:', error.stack);
    throw error; // Re-throw so caller knows it failed
  }
};
