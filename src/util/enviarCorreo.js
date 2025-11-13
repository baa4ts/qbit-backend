import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export class CorreoTienda {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  // envia resumen de productos
  async enviarResumen(email, productos) {
    if (!email || !productos?.length) throw new Error('Faltan parametros');

    const total = productos.reduce((acc, p) => acc + p.precio, 0);

    const productosHtml = productos.map(p => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          <img src="${p.img}" alt="${p.titulo}" width="60" style="border-radius:6px;" />
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          ${p.titulo}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          $${p.precio.toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family:Arial,sans-serif; background:#f3f4f6; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <div style="background:#111827; color:#fff; padding:15px 25px;">
            <h2 style="margin:0; font-size:22px;">Qbit</h2>
          </div>
          <div style="padding:25px;">
            <h3 style="color:#111827;">Resumen de tu compra</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${productosHtml}
              <tr>
                <td colspan="2" style="padding:10px; text-align:right; font-weight:bold;">Total:</td>
                <td style="padding:10px; font-weight:bold;">$${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>
          <div style="background:#f9fafb; text-align:center; padding:15px;">
            <p style="font-size:12px; color:#9ca3af;">© 2025 Qbit - Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Qbit " <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Resumen de tu compra - Qbit',
      html,
    });
  }


  // envia codigo de verificacion
  async enviarCodigo(email, codigo) {
    if (!email || !codigo) throw new Error('Faltan parametros');

    const html = `
      <div style="font-family:Arial,sans-serif; background:#f3f4f6; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <div style="background:#111827; color:#fff; padding:15px 25px;">
            <h2 style="margin:0; font-size:22px;">Qbit</h2>
          </div>
          <div style="padding:25px; text-align:center;">
            <h3 style="color:#111827;">Codigo de verificacion</h3>
            <p style="font-size:16px; color:#374151;">Tu codigo es:</p>
            <span style="font-size:32px; letter-spacing:3px; background:#111827; color:#fff; padding:10px 20px; border-radius:8px; display:inline-block;">
              <b>${codigo}</b>
            </span>
            <p style="font-size:14px; color:#6b7280; margin-top:15px;">
              Este codigo expira en 10 minutos. Si no solicitaste este codigo, ignora este correo.
            </p>
          </div>
          <div style="background:#f9fafb; text-align:center; padding:15px;">
            <p style="font-size:12px; color:#9ca3af;">© 2025 Qbit - Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: `"Qbit" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Codigo de verificacion - Qbit',
      html,
    });
  }
}