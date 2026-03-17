const emailOtpTemplate = require('../emails/templates/emailOtp');
const accountDetailsTemplate = require('../emails/templates/accountDetailsTemplate');
const sendMail = require('../emails/sendEmail');
const accountRecovery = require('./templates/accountRecovery');

exports.sendAccountDetails = async ({ firstName, username, to, password }) => {
  const template = accountDetailsTemplate({
    firstName,
    email: to,
    username,
    password,
  });
  await sendMail({ to, ...template });
};

exports.sendOtp = async (email, otp) => {
  const template = emailOtpTemplate({ otp });
  await sendMail({ to: email, ...template });
};

exports.sendAccountRecoveryRequest = async ({ email, token }) => {
  const resetLink = `localhost:5173/recovery/reset-password/${token}`;
  const template = accountRecovery({ email, resetLink });
  await sendMail({ to: email, ...template });
};
