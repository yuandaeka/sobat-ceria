const nodemailer = require('nodemailer');

/**
 * Vercel Serverless Function: POST /api/send-approval-email
 * Mengirim email notifikasi persetujuan akun secara otomatis dari sobatceria25@gmail.com
 * menggunakan Gmail SMTP + Google App Password (GMAIL_APP_PASSWORD).
 */
module.exports = async function handler(req, res) {
  // Izinkan CORS agar bisa dipanggil dari domain Vercel maupun localhost
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const gmailUser = (process.env.GMAIL_USER || 'sobatceria25@gmail.com').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

  if (!gmailPass) {
    return res.status(503).json({
      ok: false,
      configured: false,
      error: 'GMAIL_APP_PASSWORD belum disetel di Vercel Environment Variables.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const to = (body.to || '').trim();
    const name = (body.name || 'Sobat Ceria').trim();
    const roleLabel = (body.roleLabel || 'Anggota').trim();
    const accessDesc = (body.accessDesc || 'dashboard Sobat Ceria').trim();
    const platformUrl = (body.platformUrl || 'https://sobat-ceria.vercel.app').trim();

    if (!to || !to.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Alamat email tujuan tidak valid.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const subject = `Pendaftaran ${roleLabel} Sobat Ceria Telah Disetujui 🎉`;
    const text = [
      `Halo Kak ${name},`,
      '',
      `Selamat! Pendaftaran Anda sebagai ${roleLabel} di platform Sobat Ceria telah ditinjau dan DISETUJUI oleh Admin.`,
      '',
      `Anda sekarang dapat login menggunakan email ini (${to}) di ${platformUrl} untuk mengakses ${accessDesc}.`,
      '',
      'Jika ada pertanyaan, silakan hubungi tim kami via WhatsApp di 0812-3456-7890 atau balas email ini.',
      '',
      'Selamat bergabung di ekosistem Sobat Ceria!',
      '',
      'Salam hangat,',
      'Tim Sobat Ceria',
    ].join('\n');

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #FAF6F0; padding: 24px; border-radius: 20px;">
        <div style="background: #ffffff; padding: 28px; border-radius: 16px; border: 1px solid #f1f5f9;">
          <div style="display: inline-block; background: #ECFDF5; color: #059669; font-size: 11px; font-weight: 800; padding: 5px 12px; border-radius: 999px; letter-spacing: 0.5px; text-transform: uppercase;">
            Akun Disetujui
          </div>
          <h2 style="color: #162E5C; margin: 14px 0 8px; font-size: 20px;">Selamat Bergabung di Sobat Ceria! 🎉</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Halo <strong>Kak ${name}</strong>,<br/><br/>
            Pendaftaran Anda sebagai <strong style="color: #D82B5A;">${roleLabel}</strong> telah ditinjau dan <strong>DISETUJUI</strong> oleh Tim Admin Sobat Ceria.
          </p>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">
            Anda sekarang dapat langsung masuk menggunakan email ini (<strong>${to}</strong>) untuk mengakses ${accessDesc}.
          </p>
          <div style="margin: 24px 0;">
            <a href="${platformUrl}" style="display: inline-block; background: #D82B5A; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 999px;">
              Masuk ke Sobat Ceria
            </a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 20px;">
            Jika ada pertanyaan, silakan balas email ini.<br/>
            Salam hangat,<br/>
            <strong style="color: #162E5C;">Tim Sobat Ceria</strong> (${gmailUser})
          </p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Sobat Ceria" <${gmailUser}>`,
      to,
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true, messageId: info.messageId, from: gmailUser });
  } catch (err) {
    console.error('send-approval-email error:', err);
    return res.status(500).json({
      ok: false,
      error: err?.message || 'Gagal mengirim email melalui Gmail SMTP.',
    });
  }
};
