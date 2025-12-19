const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendAccountDetails = async (to, firstName, name, password) => {
  const message = {
    from: `"ParkEase - URSC Motor Parking System" <${process.env.GMAIL_EMAIL}>`,
    to,
    subject: "Your ParkEase Account Details",
    html: `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Optional: Some clients will ignore this -->
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
      font-family: 'Poppins', 'Segoe UI', Arial, Helvetica, sans-serif;
      color: #1f2937;
    "
  >
    <div
      style="
        width: 100%;
        padding: 32px 16px;
        box-sizing: border-box;
      "
    >
      <div
        style="
          max-width: 420px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 24px;
        "
      >
        <!-- Header -->
        <div
          style="
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 24px;
          "
        >
          ParkEase
        </div>

        <!-- Greeting -->
        <p
          style="
            font-size: 14px;
            margin: 0 0 8px 0;
          "
        >
          Hello <strong>${firstName}</strong>,
        </p>

        <p
          style="
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 20px 0;
          "
        >
          Your student account has been successfully created in
          <strong>ParkEase – URSC Motor Parking Management System</strong>.
          Below are your account details.
        </p>

        <!-- Account Details -->
        <div
          style="
            background-color: #f3f4f6;
            padding: 16px;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 20px;
          "
        >
          <p style="margin: 0 0 8px 0;">
            <strong>Email:</strong> ${to}
          </p>
          <p style="margin: 0 0 8px 0;">
            <strong>Name:</strong> ${name.toUpperCase()}
          </p>
          <p style="margin: 0;">
            <strong>Temporary Password:</strong>
            <span
              style="
                color: #8b5cf6;
                font-weight: 600;
              "
            >
              ${password}
            </span>
          </p>
        </div>

        <!-- Warning -->
        <div
          style="
            background-color: #fefce8;
            border-left: 4px solid #facc15;
            padding: 12px;
            font-size: 13px;
            color: #854d0e;
            margin-bottom: 20px;
            border-radius: 4px;
          "
        >
          <strong>Important:</strong><br />
          This is a temporary password. Please log in and change your password
          immediately to secure your account.
        </div>

        <!-- CTA -->
        <div
          style="
            text-align: center;
            margin-bottom: 24px;
          "
        >
          <a
            href="{{LOGIN_URL}}"
            style="
              display: inline-block;
              background-color: #8b5cf6;
              color: #ffffff;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
              padding: 12px 24px;
              border-radius: 8px;
            "
          >
            Log In to ParkEase
          </a>
        </div>

        <!-- Footer -->
        <p
          style="
            font-size: 12px;
            color: #9ca3af;
            text-align: center;
            line-height: 1.6;
            margin: 0;
          "
        >
          If you did not request this account, please ignore this email.<br />
          © 2025 ParkEase – URSC Motor Parking Management System
        </p>
      </div>
    </div>
  </body>
</html>

    `,
  };
  return await transporter.sendMail(message);
};

module.exports = sendAccountDetails;
