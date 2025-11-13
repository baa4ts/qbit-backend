import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { TokenMid } from '../middlewares/TokenMid.js';
import { checkOTPCookieMiddleware, generarOTP, generarOTPCookie, verificarOTPCookie } from '../OTP/OTP.js';
import { CorreoTienda } from '../util/enviarCorreo.js';

const router = Router()
const prisma = new PrismaClient()

const { JWT_SECRET = "MI_SECRETO", OTP_COOKIE_NAME = "qbit-otp" } = process.env;

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ ok: false, mensaje: 'Email y password son requeridos' })

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    const passwordOk = await bcrypt.compare(password, usuario.password)
    if (!passwordOk) return res.status(401).json({ ok: false, mensaje: 'Password incorrecto' })

    const token = jwt.sign(
      { id: usuario.id, permiso: usuario.permiso },
      JWT_SECRET,
      { expiresIn: '1d' }
    )


    //
    // Seguridad
    //
    const otp = generarOTP();
    generarOTPCookie(res, otp);

    //
    // Seguridad OTP
    // 
    const correo = new CorreoTienda()
    correo.enviarCodigo(email, otp)


    // response final
    res.json({ id: usuario.id, icono: usuario.icono, permiso: usuario.permiso, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' })
  }
})

// REGISTER
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body
  if (!nombre || !email || !password) return res.status(400).json({ ok: false, mensaje: 'Nombre, email y password son requeridos' })

  try {
    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) return res.status(409).json({ ok: false, mensaje: 'El usuario ya existe' })

    const passwordHash = await bcrypt.hash(password, 10)

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: passwordHash
      }
    })

    const token = jwt.sign(
      { id: nuevoUsuario.id, permiso: nuevoUsuario.permiso },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    //
    // Seguridad
    //
    const otp = generarOTP();
    generarOTPCookie(res, otp);

    //
    // Seguridad OTP
    // 
    const correo = new CorreoTienda()
    correo.enviarCodigo(email, otp)

    res.json({
      id: nuevoUsuario.id,
      icono: nuevoUsuario.icono,
      permiso: nuevoUsuario.permiso,
      token
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' })
  }
})

// POST /otp -> Verifica OTP enviado por el usuario
router.post('/otp', TokenMid, (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ ok: false, mensaje: 'OTP requerido' });

  const valido = verificarOTPCookie(req, otp);

  if (!valido) {
    return res.status(401).json({ ok: false, mensaje: 'OTP incorrecto o expirado' });
  }

  // OTP correcto: limpiar cookie y devolver ok
  res.clearCookie(OTP_COOKIE_NAME);
  return res.status(200).json({ mensaje: 'OTP verificado correctamente' });
});

// PUT /dev/usuario
router.put('/configuracion', TokenMid, checkOTPCookieMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' })

    const { nombre, icono, biografia } = req.body

    if (!nombre && !icono && !biografia) {
      return res.status(400).json({ error: 'No hay datos para actualizar' })
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    })

    if (!usuarioExistente) return res.status(404).json({ error: 'Usuario no encontrado' })

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: {
        nombre: nombre ?? usuarioExistente.nombre,
        icono: icono ?? usuarioExistente.icono,
        biografia: biografia ?? usuarioExistente.biografia,
      },
    })

    return res.status(200).json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: usuarioActualizado,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar usuario' })
  }
})

// GET /dev/usuario
router.get('/configuracion', TokenMid, checkOTPCookieMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' })

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        nombre: true,
        icono: true,
        biografia: true,
      },
    })

    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })

    return res.status(200).json(usuario)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener usuario' })
  }
})

// GET USUARIO POR UUID (incluye ultimos 3 juegos que posee)
router.get('/compartir/:uuid', async (req, res) => {
  const { uuid } = req.params

  if (!uuid) return res.status(400).json({ ok: false, mensaje: 'UUID requerido' })

  try {
    // Traer usuario e incluir hasta 3 juegos ordenados por fecha de creacion (los mas recientes)
    const usuario = await prisma.usuario.findUnique({
      where: { id: uuid },
      include: {
        juegos: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            categorias: true,
          },
        },
      },
    })

    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    res.json({
      id: usuario.id,
      icono: usuario.icono,
      nombre: usuario.nombre,
      biografia: usuario.biografia || '',
      ultimos: (usuario.juegos || []).map(j => ({
        titulo: j.titulo,
        banner: j.banner,
        categorias: (j.categorias || []).map(c => c.nombre),
        precio: j.precio,
        slug: j.slug,
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' })
  }
})

// GET USUARIO POR UUID (incluye ultimos 3 juegos que posee)
router.get('/:uuid', checkOTPCookieMiddleware, async (req, res) => {
  const { uuid } = req.params

  if (!uuid) return res.status(400).json({ ok: false, mensaje: 'UUID requerido' })

  try {
    // Traer usuario e incluir hasta 3 juegos ordenados por fecha de creacion (los mas recientes)
    const usuario = await prisma.usuario.findUnique({
      where: { id: uuid },
      include: {
        juegos: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            categorias: true,
          },
        },
      },
    })

    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' })

    res.json({
      id: usuario.id,
      icono: usuario.icono,
      nombre: usuario.nombre,
      biografia: usuario.biografia || '',
      ultimos: (usuario.juegos || []).map(j => ({
        titulo: j.titulo,
        banner: j.banner,
        categorias: (j.categorias || []).map(c => c.nombre),
        precio: j.precio,
        slug: j.slug,
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, mensaje: 'Error interno del servidor' })
  }
})

export default router