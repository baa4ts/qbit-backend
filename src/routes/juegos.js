import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { TokenMid } from '../middlewares/TokenMid.js';
import { TokenOpcional } from '../middlewares/TokenOpcional.js';
import { CorreoTienda } from "../util/enviarCorreo.js"
import { checkOTPCookieMiddleware } from '../OTP/OTP.js';

const router = Router();
const prisma = new PrismaClient();

// GET /juegos/usuario?page=1&categoria=Aventura&categoria=RPG&buscar=pal
router.get('/usuario', TokenMid, checkOTPCookieMiddleware, async (req, res) => {
  const usuarioId = req.usuario?.id
  if (!usuarioId) return res.sendStatus(401)

  const page = Number(req.query.page) || 1
  const categorias = Array.isArray(req.query.categoria)
    ? req.query.categoria
    : req.query.categoria
      ? [req.query.categoria]
      : []
  const buscar = req.query.buscar ? String(req.query.buscar).trim() : ''

  const porPagina = 10
  const skip = (page - 1) * porPagina

  try {
    const where = {
      usuarios: {
        some: { id: usuarioId },
      },
      AND: [
        buscar ? { titulo: { contains: buscar } } : {},
        categorias.length
          ? {
            categorias: {
              some: {
                nombre: { in: categorias },
              },
            },
          }
          : {},
      ],
    }

    const total = await prisma.juego.count({ where })
    const juegos = await prisma.juego.findMany({
      where,
      include: { categorias: true },
      skip,
      take: porPagina,
    })

    const response = {
      meta: {
        page,
        maxPage: Math.ceil(total / porPagina),
      },
      juegos: juegos.map(j => ({
        titulo: j.titulo,
        banner: j.banner,
        categorias: j.categorias.map(c => c.nombre),
        precio: j.precio,
        slug: j.slug,
      })),
    }

    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(500).json({ mensaje: 'Error interno del servidor' })
  }
})

router.get('/home', async (req, res) => {
  try {
    // hero (con video obligatorio)
    const hero = await prisma.juego.findFirst({
      where: {
        recursos: {
          some: { tipo: 'video' },
        },
      },
      orderBy: { contador: 'desc' },
      include: {
        recursos: {
          where: { tipo: 'video' },
          take: 1,
        },
      },
    });

    // resto de los bloques
    const [ultimos, populares, recomendados] = await Promise.all([
      prisma.juego.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          titulo: true,
          slug: true,
          banner: true,
          precio: true,
        },
      }),
      prisma.juego.findMany({
        orderBy: { contador: 'desc' },
        take: 5,
        select: {
          id: true,
          titulo: true,
          slug: true,
          banner: true,
          precio: true,
        },
      }),
      prisma.juego.findMany({
        orderBy: { contador: 'desc' },
        skip: 1,
        take: 4,
        select: {
          id: true,
          titulo: true,
          slug: true,
          banner: true,
          precio: true,
        },
      }),
    ]);

    const heroData = hero
      ? {
        titulo: hero.titulo,
        descripcion: hero.descripcion,
        slug: hero.slug,
        video: hero.recursos[0]?.recurso || '',
      }
      : null;

    res.json({
      hero: heroData,
      data: {
        ultimos,
        populares,
        recomendados,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener datos del home' });
  }
});

// POST /juegos/buy
router.post('/buy', TokenMid, checkOTPCookieMiddleware, async (req, res) => {
  const { juegos } = req.body;
  const usuarioId = req.usuario?.id;
  const datos = [];

  if (!usuarioId) return res.sendStatus(401);
  if (!Array.isArray(juegos) || juegos.length === 0) return res.status(400).json(false);

  let algunExito = false;

  try {
    for (const juegoId of juegos) {
      const juego = await prisma.juego.findUnique({
        where: { id: juegoId },
        include: { usuarios: true },
      });

      if (!juego) continue;

      // si el usuario no lo tiene, conecta y aumenta contador
      if (!juego.usuarios.some(u => u.id === usuarioId)) {
        await prisma.juego.update({
          where: { id: juegoId },
          data: {
            usuarios: { connect: { id: usuarioId } },
            contador: { increment: 1 },
          },
        });
        algunExito = true;
        datos.push({ titulo: juego.titulo, precio: juego.precio, img: juego.banner });
      }
    }

    if (algunExito) {
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: { email: true }
      });
      const correo = new CorreoTienda();
      await correo.enviarResumen(usuario.email, datos);
    }

    res.status(200).json(algunExito);
  } catch (err) {
    console.error(err);
    res.status(500).json(false);
  }
});

// GET /juegos
// Ejemplo: /api/juegos?page=1&categoria=Accion&categoria=Aventura&buscar=hades
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const take = 10
    const skip = (page - 1) * take

    const categorias = Array.isArray(req.query.categoria)
      ? req.query.categoria
      : req.query.categoria
        ? [req.query.categoria]
        : []

    const buscar = req.query.buscar?.trim() || ''

    const where = {
      ...(categorias.length && {
        categorias: {
          some: { nombre: { in: categorias } },
        },
      }),
      ...(buscar && {
        OR: [
          { titulo: { contains: buscar } },
          { autor: { nombre: { contains: buscar } } },
        ],
      }),
    }

    const [juegos, total] = await Promise.all([
      prisma.juego.findMany({
        where,
        skip,
        take,
        include: {
          categorias: true,
          autor: { select: { nombre: true } },
        },
        orderBy: { id: 'desc' },
      }),
      prisma.juego.count({ where }),
    ])

    res.json({
      meta: {
        page,
        maxPage: Math.ceil(total / take),
      },
      juegos: juegos.map(j => ({
        titulo: j.titulo,
        banner: j.banner,
        categorias: j.categorias.map(c => c.nombre),
        precio: j.precio,
        slug: j.slug,
        autor: j.autor?.nombre || 'Desconocido',
      })),
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})


// GET /juegos/:slug
// Si el usuario esta logueado, TokenMid agregara req.usuario
router.get('/:slug', TokenOpcional, checkOTPCookieMiddleware, async (req, res) => {
  const { slug } = req.params;
  const userId = req.usuario?.id || null;

  try {
    const juego = await prisma.juego.findUnique({
      where: { slug },
      include: {
        autor: true,
        categorias: true,
        recursos: true,
        usuarios: true,
      },
    });

    if (!juego) return res.status(404).json({ mensaje: 'Juego no encontrado' });

    const opciones = { usuario: false };
    if (userId && juego.usuarios.some(u => u.id === userId)) {
      opciones.usuario = true;
      opciones.descarga = juego.descarga || '';
    }

    const response = {
      id: juego.id,
      titulo: juego.titulo,
      slug: juego.slug,
      precio: juego.precio,
      autor: { id: juego.autor.id, nombre: juego.autor.nombre },
      categorias: juego.categorias.map(c => c.nombre),
      descripcion: juego.descripcion,
      recursos: juego.recursos.map(r => ({ tipo: r.tipo, recurso: r.recurso })),
      banner: juego.banner,
      opciones,
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


// DELETE /juegos/:slug
router.delete('/:slug', TokenMid, checkOTPCookieMiddleware, async (req, res) => {
  const usuarioId = req.usuario?.id;
  const { slug } = req.params;

  if (!usuarioId) return res.sendStatus(401);

  try {
    // Buscar el juego incluyendo el autor y su id
    const juego = await prisma.juego.findUnique({
      where: { slug },
      include: { autor: true },
    });

    if (!juego) {
      return res.status(404).json({ mensaje: 'Juego no encontrado' });
    }

    // Verificar que el usuario sea el autor del juego
    if (juego.autorId !== usuarioId) {
      return res.status(403).json({ mensaje: 'No puedes eliminar un juego que no creaste' });
    }

    // Borrar relaciones y juego dentro de una transaccion
    await prisma.$transaction([
      // eliminar recursos asociados
      prisma.recurso.deleteMany({ where: { juegoId: juego.id } }),
      prisma.juego.update({
        where: { id: juego.id },
        data: {
          usuarios: { set: [] },
          categorias: { set: [] },
        },
      }),
      // finalmente eliminar el juego
      prisma.juego.delete({ where: { id: juego.id } }),
    ]);

    res.json({ mensaje: 'Juego eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});


export default router;
