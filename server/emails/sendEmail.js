const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async ({ to, subject, html }) => {
  try {
    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured in environment variables');
    }

    console.log(`[EMAIL] Attempting to send to ${to} via Resend`);

    const result = await resend.emails.send({
      from: 'School Parking System <onboarding@resend.dev>', // Use Resend's verified domain initially
      to: [to],
      subject,
      html,
    });

    console.log(
      `[EMAIL] Successfully sent to ${to}. Message ID: ${result.data?.id}`,
    );
    return { success: true, messageId: result.data?.id };
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send to ${to}:`, error.message);
    console.error('[EMAIL ERROR] Full error:', error);

    // Log more details for debugging
    if (error.response) {
      console.error('[EMAIL ERROR] Response status:', error.response.status);
      console.error('[EMAIL ERROR] Response data:', error.response.data);
    }

    throw error;
  }
};
