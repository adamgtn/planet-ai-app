/**
 * Pengirim email transaksional via SMTP (nodemailer).
 *
 * Dipakai oleh webhook orderonline (app/api/orderonline/webhook) untuk
 * mengirim kredensial login ke member baru setelah pembayaran.
 *
 * SMTP dibaca dari env (lihat .env.example). Kalau env belum lengkap,
 * mailerReady() = false dan sendCredentialEmail() akan throw — caller
 * harus cek mailerReady() dulu supaya akun tetap dibuat walau email gagal.
 *
 * CATATAN: file ini SERVER-ONLY. Jangan diimport dari komponen "use client".
 */

import "server-only";
import nodemailer from "nodemailer";

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

function readSmtp(): SmtpConfig | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;
  if (!host || !user || !pass || !from) return null;

  const port = Number(process.env.SMTP_PORT || 587);
  // secure=true untuk port 465 (SSL), false untuk 587/25 (STARTTLS)
  const secure = (process.env.SMTP_SECURE || (port === 465 ? "true" : "false")) === "true";
  return { host, port, secure, user, pass, from };
}

/** True kalau konfigurasi SMTP lengkap. Cek ini sebelum kirim email. */
export function mailerReady(): boolean {
  return readSmtp() !== null;
}

let _transporter: nodemailer.Transporter | null = null;

function getTransporter(cfg: SmtpConfig): nodemailer.Transporter {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: { user: cfg.user, pass: cfg.pass },
    });
  }
  return _transporter;
}

const APP_LOGIN_URL = process.env.APP_LOGIN_URL || "https://planetsoft.id/app";
const WA_ADMIN = process.env.WA_ADMIN_NUMBER || "6285780685293";
const LOGO_URL = "https://planetsoft.id/brand/planetsoft-icon.png";

type CredentialEmail = {
  to: string;
  name: string;
  /** Password plain (acak) yang baru dibuat. */
  password: string;
};

/**
 * Kirim email "selamat datang + kredensial login" ke member baru.
 * Throw kalau SMTP belum dikonfigurasi atau pengiriman gagal.
 */
export async function sendCredentialEmail({ to, name, password }: CredentialEmail): Promise<void> {
  const cfg = readSmtp();
  if (!cfg) throw new Error("SMTP belum dikonfigurasi (cek env SMTP_*)");

  const transporter = getTransporter(cfg);
  const safeName = name?.trim() || "Sahabat PlanetPrompt";

  const waLink = `https://wa.me/${WA_ADMIN}`;

  const text = [
    `Halo ${safeName},`,
    "",
    "Selamat! Akun PlanetPrompt kamu sudah aktif. Berikut detail login kamu:",
    "",
    `Login di : ${APP_LOGIN_URL}`,
    `Email    : ${to}`,
    `Password : ${password}`,
    "",
    "PENTING — Akun ini untuk kamu pribadi.",
    "Jangan login di lebih dari 1 akun/perangkat orang lain dan jangan",
    "dibagikan ke siapa pun. Akun yang dibagikan akan otomatis diblokir (banned).",
    "",
    "Demi keamanan, ganti password kamu setelah login pertama.",
    "",
    `Butuh bantuan? Chat admin via WhatsApp: ${waLink}`,
    "",
    "Salam,",
    "Tim PlanetPrompt",
  ].join("\n");

  const html = `
  <div style="background:#f6f7f9;padding:24px 12px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #eceef1;border-radius:18px;overflow:hidden">
      <div style="padding:22px 24px 0;text-align:center">
        <img src="${LOGO_URL}" width="44" height="44" alt="PlanetSoft" style="display:inline-block;vertical-align:middle;border:0" />
        <span style="display:inline-block;vertical-align:middle;margin-left:8px;font-size:20px;font-weight:800;letter-spacing:-0.3px"><span style="color:#1f2430">planet</span><span style="color:#FF6B00">soft</span></span>
      </div>
      <div style="padding:18px 26px 26px;color:#1f2430">
        <h2 style="margin:0 0 4px;font-size:20px">Akun PlanetPrompt kamu sudah aktif 🎉</h2>
        <p style="margin:0 0 16px;color:#4b5563">Halo <b>${escapeHtml(safeName)}</b>, terima kasih sudah bergabung. Berikut detail login kamu:</p>

        <div style="background:#f8f9fb;border:1px solid #eceef1;border-radius:14px;padding:16px 18px;margin:0 0 16px">
          <p style="margin:0 0 10px"><span style="color:#6b7280;font-size:13px">Login di</span><br><a href="${APP_LOGIN_URL}" style="color:#FF6B00;font-weight:700;text-decoration:none">${APP_LOGIN_URL}</a></p>
          <p style="margin:0 0 10px"><span style="color:#6b7280;font-size:13px">Email</span><br><b>${escapeHtml(to)}</b></p>
          <p style="margin:0"><span style="color:#6b7280;font-size:13px">Password</span><br><b style="font-family:ui-monospace,monospace;font-size:16px;letter-spacing:0.5px">${escapeHtml(password)}</b></p>
        </div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px">
          <tr><td style="background:#fff4ed;border:1px solid #ffd9bf;border-radius:14px;padding:14px 16px;color:#9a3412;font-size:13px;line-height:1.5">
            <b>⚠️ Penting — akun ini untuk kamu pribadi.</b><br>
            Jangan login di lebih dari 1 akun/perangkat orang lain dan <b>jangan dibagikan</b> ke siapa pun. Akun yang dibagikan akan <b>otomatis diblokir (banned)</b>.
          </td></tr>
        </table>

        <p style="margin:0 0 18px;color:#4b5563;font-size:14px">Demi keamanan, ganti password kamu setelah login pertama.</p>

        <a href="https://wa.me/${WA_ADMIN}" style="display:inline-block;background:#25D366;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none;padding:11px 18px;border-radius:12px">💬 Butuh bantuan? Chat admin via WhatsApp</a>

        <p style="margin:18px 0 0;color:#9ca3af;font-size:12px">Email ini dikirim otomatis oleh PlanetPrompt. Kalau kamu tidak merasa mendaftar, abaikan saja.</p>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject: "Akun PlanetPrompt kamu sudah aktif — detail login di dalam",
    text,
    html,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
