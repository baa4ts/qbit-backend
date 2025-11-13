import jwt from 'jsonwebtoken';

export const TokenOpcional = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const secreto = process.env.JWT_SECRET || 'MI_SECRETO';

        const decoded = jwt.verify(token, secreto);
        req.usuario = decoded;
        next();
    } catch (err) {
        console.error(err);
        next();
    }
};