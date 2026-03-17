module.exports = ({ email, name, token }) => {
  const base = process.env.SERVER_URL || 'http://localhost:5000';
  const verifyUrl = `${base}/user/verify-email/${token}`;
  return {
  subject: 'Email Verification',

  html: `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Email Verification</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
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
    <div style="width: 100%; padding: 32px 16px; box-sizing: border-box;">
      <div
        style="
          max-width: 420px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          font-family: 'Poppins', 'Segoe UI', Arial, Helvetica, sans-serif;
        "
      >
        <!-- Header -->
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 22px;
            font-weight: 700;
            color: #8b5cf6;
            margin-bottom: 24px;
            font-family: 'Poppins', 'Segoe UI', Arial, Helvetica, sans-serif;
          "
        >
          <svg viewBox="0 0 612 792" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#8E51FF"
              d="M9.9,106.6c0,28.4,23,51.4,51.4,51.4h314.3c4.3,0,8.6,0.5,12.7,1.6
              c25.6,6.5,109.8,36.2,109.8,144c0,107.9-75.1,133.4-97.8,138.6
              c-3.7,0.9-7.4,1.2-11.2,1.2H61.3c-28.4,0-51.4,23-51.4,51.4
              c0,28.4,23,51.4,51.4,51.4h334.7c4.7,0,9.3-0.6,13.9-1.9
              c33.6-9.6,171.4-59.5,192-236.4c0.4-3.2,0.4-6.3,0.2-9.5
              C599.9,266,580.1,98.4,408.7,55.8c-4-1-8.3-1.5-12.4-1.5H61.3
              C32.9,55.2,9.9,78.2,9.9,106.6z"
            />
          </svg>
          <span>ParkEase</span>
        </div>

        <!-- Greeting -->
        <p style="font-size: 14px; margin: 0 0 8px 0;">
          Hello <strong>${name}</strong>,
        </p>

        <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Thank you for registering with <strong>ParkEase</strong>. To complete
          your account setup, please verify your email address by clicking the
          button below.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 16px;">
          <a
            href="${verifyUrl}"
            style="
              display: inline-block;
              background-color: #8b5cf6;
              color: #ffffff;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
              padding: 12px 24px;
              border-radius: 8px;
              font-family: 'Poppins', 'Segoe UI', Arial, Helvetica, sans-serif;
            "
          >
            Verify Email Address
          </a>
        </div>

        <!-- Copy Link Fallback -->
        <p style="font-size: 12px; color: #6b7280; line-height: 1.6; margin-bottom: 20px; text-align: center;">
          If the button does not work, copy and paste this link into your browser:
          <br />
          <a href="${verifyUrl}" style="color: #8b5cf6; word-break: break-all;">
            ${verifyUrl}
          </a>
        </p>

        <!-- Security Note -->
        <p style="font-size: 12px; color: #6b7280; line-height: 1.6; margin-bottom: 20px;">
          This verification link is valid for
          <strong style="color: #e11d48;">15 minutes</strong> and can only be used
          once. If you did not create this account, you may safely ignore this
          email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

        <!-- Footer -->
        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
          © 2025 ParkEase – URSC Motor Parking Management System
        </p>
      </div>
    </div>
  </body>
</html>`,
  };
};
