const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async ({ to, subject, html }) => {
  try {
    const { error } = await resend.emails.send({
      from: 'School Parking System <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    if (error) console.error(`[EMAIL ERROR]`, error.message);
    else console.log(`[EMAIL] Sent to ${to}`);
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${to}:`, error.message);
  }
};
