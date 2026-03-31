const nodemailer = require('nodemailer');

module.exports = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `"School Parking System" <${process.env.GMAIL_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log(`[EMAIL] Sent to ${to}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] ${error.message}`);
  }
};
