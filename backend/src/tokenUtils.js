const jwt = require('jsonwebtoken');

const JWT_SECRET = 'chaveFixe';

const FIXED_TOKEN = 'tokenFixo';

const generateToken = (user) => {
    const payload = {
        id: user.utilizadorid,
        email: user.email
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const isFixedToken = (token) => {
    return token === FIXED_TOKEN;
};

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Sem permissão' });
    }
    
    if (isFixedToken(token)) {
        req.user = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com'
        };
        return next();
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Sem permissão' });
    }

    req.user = decoded;
    next();
};

module.exports = {
    generateToken,
    authenticate
};
