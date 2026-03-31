module.exports = ({ otp }) => ({
  subject: 'Your OTP Code',
  html: `<div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
  <div style="width: 100%; margin-bottom: 12px; text-align: center;">
    <h1 style="font-weight: bold; font-size: 18px; color: #8b5cf6; margin: 0;">
      School Parking System
      <span style="color: #1f2937;">
        - URSC Motor Parking Management
      </span>
    </h1>
  </div>

  <table width="100%" cellspacing="0" cellpadding="0" border="0" style="text-align: center;">
    <tr>
      <td>
        <p style="font-size: 14px; color: #1f2937; margin: 0 0 10px;">
          Use the code below to complete your verification:
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <h1 style="font-weight: bold; font-size: 30px; color: #1f2937; margin: 0 0 10px;">
          ${otp}
        </h1>
      </td>
    </tr>
    <tr>
      <td>
        <p style="font-size: 12px; color: #1f2937; margin: 0;">
          This code will expire in:
          <span style="font-weight: bold;">5 minutes</span>
        </p>
      </td>
    </tr>
  </table>
</div>

`,
});
