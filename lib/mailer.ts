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

const APP_LOGIN_URL = process.env.APP_LOGIN_URL || "https://planetsoft.id/login";

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

  const text = [
    `Halo ${safeName},`,
    "",
    "Selamat! Akun PlanetPrompt kamu sudah aktif. Berikut detail login kamu:",
    "",
    `Login di : ${APP_LOGIN_URL}`,
    `Email    : ${to}`,
    `Password : ${password}`,
    "",
    "Demi keamanan, ganti password kamu setelah login pertama.",
    "",
    "Kalau butuh bantuan, balas email ini atau chat admin via WhatsApp.",
    "",
    "Salam,",
    "Tim PlanetPrompt",
  ].join("\n");

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:520px;margin:0 auto;color:#1f2430">
    <h2 style="margin:0 0 4px">Akun PlanetPrompt kamu sudah aktif 🎉</h2>
    <p style="margin:0 0 16px;color:#4b5563">Halo <b>${escapeHtml(safeName)}</b>, terima kasih sudah bergabung. Berikut detail login kamu:</p>
    <div style="background:#f5f3ff;border:1px solid #e9d5ff;border-radius:14px;padding:16px 18px;margin:0 0 16px">
      <p style="margin:0 0 8px"><span style="color:#6b7280">Login di</span><br><a href="${APP_LOGIN_URL}" style="color:#7c3aed;font-weight:700">${APP_LOGIN_URL}</a></p>
      <p style="margin:0 0 8px"><span style="color:#6b7280">Email</span><br><b>${escapeHtml(to)}</b></p>
      <p style="margin:0"><span style="color:#6b7280">Password</span><br><b style="font-family:ui-monospace,monospace;font-size:16px">${escapeHtml(password)}</b></p>
    </div>
    <p style="margin:0 0 8px;color:#4b5563">Demi keamanan, ganti password kamu setelah login pertama.</p>
    <p style="margin:0;color:#9ca3af;font-size:13px">Butuh bantuan? Balas email ini atau chat admin via WhatsApp.</p>
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
