import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const {
    OTP_COOKIE_NAME = 'qbit-otp',
    OTP_SESSION_COOKIE_NAME = 'qbit-session',
    OTP_COOKIE_PASS = 'as009ad099a',
    NODE_ENV = "production",
    JWT_SECRET = "mi_jwt_secret"
} = process.env;

// =========================
// Generar codigo OTP
// =========================
export const generarOTP = () => {
    return String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
};

// =========================
// Crear cookie OTP
// =========================
export const generarOTPCookie = (res, otp) => {
    const otpFirmado = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(otp)
        .digest('hex');

    res.cookie(OTP_COOKIE_NAME, otpFirmado, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 min
    });
};

// =========================
// Crear / renovar cookie de sesion
// =========================
export const crearSessionCookie = (req, res) => {
    const huella = req.headers['user-agent'] + req.ip;
    const sessionFirmada = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(huella)
        .digest('hex');

    res.cookie(OTP_SESSION_COOKIE_NAME, sessionFirmada, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
    });
};

// =========================
// Verificar OTP ingresado y eliminar cookie de OTP
// =========================
export const verificarOTPCookie = (req, otpIngresado, res) => {
    const cookie = req.cookies ? req.cookies[OTP_COOKIE_NAME] : null;
    if (!cookie) return false;

    const otpFirmado = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(otpIngresado)
        .digest('hex');

    const valido = otpFirmado === cookie;

    if (valido) {
        res.clearCookie(OTP_COOKIE_NAME, {
            httpOnly: true,
            secure: NODE_ENV === 'production',
            sameSite: 'strict',
        });
        crearSessionCookie(req, res);
    }

    return valido;
};

// =========================
// Middleware: OTP pendiente
// =========================
export const checkOTPCookieMiddleware = (req, res, next) => {
    const cookie = req.cookies ? req.cookies[OTP_COOKIE_NAME] : null;
    if (cookie) return res.status(419).json({ ok: false, mensaje: 'OTP pendiente' });
    next();
};

// =========================
// Middleware: forzar OTP + renovar sesion y JWT
// =========================
export const requireOTPVerifiedMiddleware = (req, res, next) => {
    const cookie = req.cookies ? req.cookies[OTP_SESSION_COOKIE_NAME] : null;
    if (!cookie) return res.status(403).json({ ok: false, mensaje: 'Debes pasar OTP' });

    const huella = req.headers['user-agent'] + req.ip;
    const expected = crypto.createHmac('sha256', OTP_COOKIE_PASS)
        .update(huella)
        .digest('hex');

    if (cookie !== expected) return res.status(403).json({ ok: false, mensaje: 'Sesion invalida, debes pasar OTP nuevamente' });

    // Renovar cookie de sesion
    crearSessionCookie(req, res);

    // Renovar JWT si existe req.usuario
    if (req.usuario) {
        const nuevoJWT = jwt.sign(
            { id: req.usuario.id, permiso: req.usuario.permiso },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.setHeader('x-renewed-jwt', nuevoJWT);
    }

    next();
};