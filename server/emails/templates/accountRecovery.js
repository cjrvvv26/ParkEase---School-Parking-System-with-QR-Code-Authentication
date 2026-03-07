module.exports = ({ resetLink, email }) => ({
  subject: 'Account Recovery Request',
  html: `
<div style="background:#f9fafb;padding:30px 0;font-family:Poppins,'Segoe UI',Arial,Helvetica,sans-serif;color:#1f2937;">
  <div style="max-width:420px;margin:auto;background:#ffffff;padding:24px;border-radius:6px;">

    <!-- Header -->
    <div style="text-align:center;font-size:22px;font-weight:bold;color:#7c3aed;margin-bottom:24px;">
      ParkEase
    </div>

    <p style="font-size:14px;line-height:1.6;margin-bottom:20px;">
      We received a request to recover your account for
      <strong>ParkEase – URSC Motor Parking Management System</strong>.
      If you made this request, click the button below to reset your password.
    </p>

    <!-- Recovery Details -->
    <div style="background:#f3f4f6;padding:14px;border-radius:6px;font-size:14px;margin-bottom:20px;">
      <p style="margin-bottom:6px;"><strong>Account Email:</strong> ${email}</p>
    </div>

    <!-- Warning -->
    <div style="background:#fffbeb;border-left:4px solid #facc15;padding:12px;font-size:13px;color:#92400e;margin-bottom:20px;border-radius:4px;">
      <strong>Important:</strong><br/>
      This recovery link will expire in <strong>10 minutes</strong> for security reasons.
    </div>

    <table role="presentation" cellspacing="0" cellpadding="0" align="center" style="margin-bottom:24px;">
      <tr>
        <td align="center" bgcolor="#7c3aed" style="border-radius:6px;">
          <a target="_blank" href="${resetLink}" 
             style="display:inline-block;padding:12px 22px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
            Reset Your Password
          </a>
        </td>
      </tr>
    </table>

    <!-- Alternative Link -->
    <p style="font-size:12px;color:#6b7280;margin-bottom:16px;text-align:center;word-break:break-all;">
      If the button above does not work, copy and paste this link into your browser:<br/>
      <a target="_blank" href=${resetLink} style="color:#7c3aed;">${resetLink}</a>
    </p>

    <!-- Footer -->
    <p style="font-size:11px;color:#9ca3af;text-align:center;line-height:1.5;">
      If you did not request account recovery, you can safely ignore this email.
      Your account will remain secure.<br/>
      © 2026 ParkEase – URSC Motor Parking Management System
    </p>

  </div>
</div>
`,
});
