const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async ({ to, subject, html }) => {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured in environment variables');
    }

    console.log(`[EMAIL] Sending to ${to} via Resend API`);

    const result = await resend.emails.send({
      from: 'School Parking System <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    });

    console.log(`[EMAIL] ✅ Sent successfully. Message ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error(`[EMAIL ERROR] ❌ Failed to send to ${to}:`, error.message);

    // For testing: if it's your own email domain, it should work
    if (to.includes('@gmail.com') || to.includes('@yourdomain.com')) {
      console.log(
        '[EMAIL] Note: Resend default domain only works reliably for same-domain emails',
      );
    }

    throw error;
  }
};
