import crypto from 'crypto';

const {
    OTP_COOKIE_NAME = 'qbit-otp',
    OTP_COOKIE_PASS = 'as009ad099a',
    NODE_ENV
} = process.env;

// Generar codigo OTP
export const generarOTP = () => {
    // Codigo aleatorio de 6 digitos
    return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
};

// Crear cookie
export const generarOTPCookie = (res, otp, ttlMs = 15 * 60 * 1000) => {
    // Firmar el OTP para que no pueda modificarse
    const otpFirmado = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(otp)
        .digest('hex');

    res.cookie(OTP_COOKIE_NAME, otpFirmado, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: ttlMs,
        path: '/',
    });
};

// Verificar OTP ingresado en la cookie
export const verificarOTPCookie = (req, otpIngresado) => {
    const cookie = req.cookies?.[OTP_COOKIE_NAME];
    if (!cookie) return false;

    // Generar el hash del OTP ingresado para compararlo
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