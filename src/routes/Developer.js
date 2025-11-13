import express from 'express'
import { PrismaClient } from '@prisma/client'
import { TokenMid } from '../middlewares/TokenMid.js'
import { checkOTPCookieMiddleware, requireOTPVerifiedMiddleware } from '../OTP/OTP.js'

const prisma = new PrismaClient()
const router = express.Router()

// GET /api/dev
router.get('/', TokenMid, checkOTPCookieMiddleware, requireOTPVerifiedMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId)
      return res.status(401).json({ error: 'No autenticado' })

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nombre: true,
        email: true,
        permiso: true,
      },
    })

    if (!usuario)
      return res.status(404).json({ error: 'Usuario no encontrado' })

    if (usuario.permiso !== 2)
      return res.status(403).json({ error: 'El usuario no es desarrollador' })

    const juegos = await prisma.juego.findMany({
      where: { autorId: usuario.id },
      select: {
        id: true,
        titulo: true,
        slug: true,
        precio: true,
        contador: true,
        descarga: true,
        recursos: {
          select: {
            tipo: true,
            recurso: true,
          },
        },
      },
    })

    // Totales globales
    const totalJuegos = juegos.length
    const totalDescargas = juegos.reduce((acc, j) => acc + (j.contador || 0), 0)
    const totalRecaudado = juegos.reduce(
      (acc, j) => acc + ((j.precio || 0) * (j.contador || 0)),
      0
    )

    // Estadisticas por juego
    const juegosConEstadisticas = juegos.map(j => ({
      ...j,
      descargas: j.contador || 0,
      recaudado: (j.precio || 0) * (j.contador || 0),
    }))

    return res.json({
      desarrollador: usuario,
      totales: {
        totalJuegos,
        totalDescargas,
        totalRecaudado,
      },
      juegos: juegosConEstadisticas,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al obtener datos del desarrollador' })
  }
})

// POST /dev/new
router.post('/new', TokenMid, checkOTPCookieMiddleware, requireOTPVerifiedMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId)
      return res.status(401).json({ error: 'No autenticado' })

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, permiso: true },
    })

    if (!usuario)
      return res.status(404).json({ error: 'Usuario no encontrado' })

    if (usuario.permiso !== 2)
      return res.status(403).json({ error: 'El usuario no es desarrollador' })

    const {
      titulo,
      precio = 0,
      descripcion = '',
      descarga = '',
      recursos = [],
      categorias = [],
      banner = '',
    } = req.body

    if (!titulo)
      return res.status(400).json({ error: 'Faltan campos obligatorios' })

    console.log(categorias)
    // Generar slug automaticamente a partir del titulo
    const slug = titulo
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const nuevoJuego = await prisma.juego.create({
      data: {
        titulo,
        slug,
        precio: parseFloat(precio),
        descripcion,
        descarga,
        autorId: usuario.id,
        banner,
        recursos: {
          create: recursos.map(r => ({
            tipo: r.tipo,
            recurso: r.url || r.recurso,
          })),
        },
        categorias: {
          connectOrCreate: categorias.map(nombre => ({
            where: { nombre },
            create: { nombre },
          })),
        },
      },
      include: {
        recursos: true,
        categorias: true,
      },
    })

    return res.status(201).json({
      mensaje: 'Juego publicado exitosamente',
      juego: nuevoJuego,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al publicar el juego' })
  }
})

// PUT /dev/edit/:slug
router.put('/edit/:slug', TokenMid, checkOTPCookieMiddleware, requireOTPVerifiedMiddleware, async (req, res) => {
  try {
    const usuarioId = req.usuario?.id
    if (!usuarioId) return res.status(401).json({ error: 'No autenticado' })

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, permiso: true },
    })
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
    if (usuario.permiso !== 2) return res.status(403).json({ error: 'El usuario no es desarrollador' })

    const { slug } = req.params
    const {
      titulo,
      precio = 0,
      descripcion = '',
      descarga = '',
      recursos = [],
      categorias = [],
      banner = '',
    } = req.body

    if (!titulo) return res.status(400).json({ error: 'Faltan campos obligatorios' })

    const juegoExistente = await prisma.juego.findUnique({
      where: { slug },
      include: { recursos: true, categorias: true },
    })
    if (!juegoExistente) return res.status(404).json({ error: 'Juego no encontrado' })
    if (juegoExistente.autorId !== usuario.id) return res.status(403).json({ error: 'No puedes editar este juego' })

    // Generar nuevo slug si cambio el titulo
    const nuevoSlug = titulo !== juegoExistente.titulo
      ? titulo.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
      : slug

    // Actualizar juego
    const juegoActualizado = await prisma.juego.update({
      where: { id: juegoExistente.id },
      data: {
        titulo,
        slug: nuevoSlug,
        precio: parseFloat(precio),
        descripcion,
        descarga,
        banner,
        recursos: {
          deleteMany: {}, // elimina todos los recursos actuales
          create: recursos.map(r => ({
            tipo: r.tipo,
            recurso: r.url || r.recurso,
          })),
        },
        categorias: {
          set: [], // limpia categorias actuales
          connectOrCreate: categorias.map(nombre => ({
            where: { nombre },
            create: { nombre },
          })),
        },
      },
      include: { recursos: true, categorias: true },
    })

    return res.status(200).json({
      mensaje: 'Juego actualizado exitosamente',
      juego: juegoActualizado,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error al actualizar el juego' })
  }
})

export default router