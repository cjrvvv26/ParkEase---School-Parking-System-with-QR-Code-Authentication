const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

module.exports = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"ParkEase - URSC Motor Parking System" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject,
    html,
  });
};
