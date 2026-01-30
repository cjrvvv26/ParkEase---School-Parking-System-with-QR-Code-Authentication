const emailOtpTemplate = require("../emails/templates/emailOtp");
const accountDetailsTemplate = require("../emails/templates/accountDetailsTemplate");
const accountVerification = require("../emails/templates/accountVerification");
const sendMail = require("../emails/sendEmail");

exports.sendAccountDetails = async ({ firstName, username, to, password }) => {
  const template = accountDetailsTemplate({
    firstName,
    email: to,
    username,
    password,
  });
  await sendMail({ to, ...template });
};

exports.sendAccountVerification = async ({ email, firstName, token }) => {
  const template = accountVerification({
    name: firstName,
    email,
    token,
  });
  await sendMail({ to: email, ...template });
};

exports.sendOtp = async (email, otp) => {
  const template = emailOtpTemplate({ otp });
  await sendMail({ to: email, ...template });
};
