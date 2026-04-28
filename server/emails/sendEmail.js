const { Resend } = require('resend');

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not configured in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

const extractEmail = (value) => {
  if (!value) return null;
  const match = value.match(/<([^>]+)>$/);
  return match ? match[1] : value;
};

const isValidEmailAddress = (value) => {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const isReservedTld = (value) => {
  if (!value) return false;
  const reservedTlds = [
    '.localhost',
    '.local',
    '.test',
    '.invalid',
    '.example',
  ];
  return reservedTlds.some((tld) => value.toLowerCase().endsWith(tld));
};

const defaultFrom = 'School Parking System <onboarding@resend.dev>';
const getFromAddress = () => {
  const rawSender = process.env.RESEND_FROM || process.env.EMAIL_FROM;
  if (!rawSender) return defaultFrom;

  const safeSender = rawSender.trim();
  const senderEmail = extractEmail(safeSender);

  if (!isValidEmailAddress(senderEmail) || isReservedTld(senderEmail)) {
    console.warn(
      `[SEND EMAIL] Invalid or reserved sender address detected. Falling back to default from: ${defaultFrom}`,
    );
    return defaultFrom;
  }

  return safeSender;
};

const from = getFromAddress();

module.exports = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error('Email recipient is required');
  }
  if (!subject) {
    throw new Error('Email subject is required');
  }
  if (!html) {
    throw new Error('Email html body is required');
  }

  const recipients = Array.isArray(to) ? to : [to];
  const invalidRecipient = recipients.find(
    (recipient) => !isValidEmailAddress(extractEmail(recipient)),
  );
  if (invalidRecipient) {
    throw new Error(`Invalid recipient email address: ${invalidRecipient}`);
  }

  try {
    console.log('[SEND EMAIL] Sending email', {
      from,
      to: recipients,
      subject,
    });
    const result = await resend.emails.send({
      from,
      to: recipients,
      subject,
      html,
    });

    if (result.error) {
      console.error('[SEND EMAIL ERROR] Resend API returned an error', {
        to: recipients,
        subject,
        from,
        apiError: result.error,
      });
      throw new Error(result.error.message || 'Resend email send failed');
    }

    console.log('[SEND EMAIL] Sent successfully', {
      id: result.data?.id,
      status: result.data?.status,
      object: result.data?.object,
    });
    return result.data ?? result;
  } catch (error) {
    console.error('[SEND EMAIL ERROR]', {
      to: recipients,
      subject,
      from,
      message: error.message,
    });
    throw error;
  }
};
