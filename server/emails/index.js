const emailOtpTemplate = require('../emails/templates/emailOtp');
const accountDetailsTemplate = require('../emails/templates/accountDetailsTemplate');
const sendMail = require('../emails/sendEmail');
const accountRecovery = require('./templates/accountRecovery');

exports.sendAccountDetails = async ({ firstName, username, to, password }) => {
  try {
    const template = accountDetailsTemplate({
      firstName,
      email: to,
      username,
      password,
    });
    const result = await sendMail({ to, ...template });
    return result;
  } catch (error) {
    console.error(`[ACCOUNT DETAILS EMAIL] Error for ${to}:`, error.message);
    throw error;
  }
};

exports.sendOtp = async (email, otp) => {
  try {
    const template = emailOtpTemplate({ otp });
    const result = await sendMail({ to: email, ...template });
    return result;
  } catch (error) {
    console.error(`[OTP EMAIL] Error for ${email}:`, error.message);
    throw error;
  }
};

exports.sendAccountRecoveryRequest = async ({ email, token }) => {
  try {
    const resetLink = `${process.env.SERVER_URL}/recovery/reset-password/${token}`;
    const template = accountRecovery({ email, resetLink });
    const result = await sendMail({ to: email, ...template });
    return result;
  } catch (error) {
    console.error(`[RECOVERY EMAIL] Error for ${email}:`, error.message);
    throw error;
  }
};
