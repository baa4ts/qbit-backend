import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /categorias - obtener todas las categorias
router.get('/', async (req, res) => {
    try {
        const categorias = await prisma.categoria.findMany({
            orderBy: { nombre: 'asc' }
        });
        res.json(categorias);
    } catch (err) {
        console.error(err);
        res.status(500).json({ mensaje: 'Error al obtener categorias' });
    }
});

export default router;
