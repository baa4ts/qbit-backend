import crypto from 'crypto';

const {
    OTP_COOKIE_NAME = 'qbit-otp',
    OTP_COOKIE_PASS = 'as009ad099a',
    NODE_ENV
} = process.env;

// Generar codigo otp
export const generarOTP = () => {
    return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
};

// Crear cookie
export const generarOTPCookie = (res, otp, ttlMs = 15 * 60 * 1000) => {
    const otpFirmado = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(otp)
        .digest('hex');

    res.cookie(OTP_COOKIE_NAME, otpFirmado, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: ttlMs,
    });
};

// Verificar OTP ingresado en la cookie
export const verificarOTPCookie = (req, otpIngresado) => {
    const cookie = req.cookies?.[OTP_COOKIE_NAME];
    if (!cookie) return false;

    const otpFirmado = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(otpIngresado)
        .digest('hex');

    return otpFirmado === cookie;
};

// Middleware para detectar si paso el OTP
export const checkOTPCookieMiddleware = (req, res, next) => {
    const cookie = req.cookies?.[OTP_COOKIE_NAME];
    if (cookie) return res.status(419).json({ ok: false, mensaje: 'OTP pendiente, expiracion 15min' });
    next();
};

