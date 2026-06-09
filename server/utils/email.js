const { Resend } = require('resend');

// Detect if we have a real API key or a placeholder
const hasRealResendKey = () => {
  const key = process.env.RESEND_API_KEY || '';
  return key.startsWith('re_') && key.length > 10 && key !== 're_your_resend_api_key_here';
};

const OTP_EMAIL_TEMPLATE = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: 'Inter', -apple-system, sans-serif; background: #f8f5f0; margin: 0; padding: 20px; }
    .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #2D6A4F 0%, #52B788 100%); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .body { padding: 32px; }
    .otp-box { background: #f0fdf4; border: 2px solid #52B788; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp { font-size: 40px; font-weight: 900; letter-spacing: 8px; color: #2D6A4F; font-family: monospace; }
    .note { color: #6b7280; font-size: 13px; line-height: 1.6; }
    .footer { background: #f8f5f0; padding: 20px 32px; text-align: center; color: #9ca3af; font-size: 12px; }
    .trust { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; color: #2D6A4F; padding: 8px 16px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏘️ Padosi</h1>
      <p>Your Trusted Neighborhood Network</p>
    </div>
    <div class="body">
      <p style="color:#1f2937;font-size:16px;font-weight:600;margin-bottom:4px;">Your verification code:</p>
      <p class="note">Enter this code to verify your email and join your colony.</p>
      <div class="otp-box">
        <div class="otp">${otp}</div>
        <p style="color:#6b7280;font-size:13px;margin:8px 0 0;">Valid for <strong>5 minutes</strong></p>
      </div>
      <p class="note">If you didn't request this code, you can safely ignore this email. Someone may have typed your email by mistake.</p>
      <div class="trust">🛡️ Padosi never asks for your OTP over phone or chat</div>
    </div>
    <div class="footer">
      <p>© 2025 Padosi · Hyperlocal India · Trusted Community</p>
    </div>
  </div>
</body>
</html>
`;

exports.sendOtpEmail = async (email, otp) => {
  // ── ALWAYS print OTP to console for easy local testing ──────────────────
  console.log('\n');
  console.log('╔══════════════════════════════════════╗');
  console.log(`║  📧 OTP for ${email.padEnd(26)}║`);
  console.log(`║  🔑 Code: ${otp.padEnd(28)}║`);
  console.log('╚══════════════════════════════════════╝');
  console.log('\n');

  // ── Send email only if a real Resend API key is configured ───────────────
  if (!hasRealResendKey()) {
    console.log('ℹ️  [DEV] No valid RESEND_API_KEY — OTP shown above in console only.');
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Padosi <onboarding@resend.dev>',
      to: email,
      subject: `${otp} — Your Padosi verification code`,
      html: OTP_EMAIL_TEMPLATE(otp),
    });
    console.log(`✅ OTP email sent to ${email}`);
  } catch (err) {
    console.error('❌ Resend email error:', err.message);
    // Don't throw — OTP is already in DB, user can still verify via console
  }
};
