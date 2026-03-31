const { Resend } = require('resend');

module.exports = async ({ to, subject, html }) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'School Parking System <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    if (error) console.error(`[EMAIL ERROR]`, JSON.stringify(error));
    else console.log(`[EMAIL] Sent to ${to}, id: ${data?.id}`);
  } catch (err) {
    console.error(`[EMAIL ERROR]`, err.message);
  }
};
