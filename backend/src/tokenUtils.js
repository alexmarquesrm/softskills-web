const jwt = require('jsonwebtoken');

// Idealmente isso deveria estar em variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'chaveFixe';

/**
 * Gera um token JWT para o usuário
 * @param {Object} user - Objeto do usuário
 * @returns {String} Token JWT
 */
const generateToken = (user) => {
    console.log('Gerando token para o usuário:', user);
    const payload = {
        id: user.utilizadorid || user.colaborador_id,
        email: user.email,
        tipo: user.tipo,
        allUserTypes: user.allUserTypes
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });
};

/**
 * Verifica e decodifica um token JWT
 * @param {String} token - Token JWT para verificar
 * @returns {Object|null} - Payload decodificado ou null se inválido
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error('Erro na verificação do token:', error.message);
        return null;
    }
};

/**
 * Middleware para autenticar requisições
 */
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    // Remover token fixo em produção - isso é uma vulnerabilidade séria
    // TODO: Remover completamente essa lógica em produção
    if (process.env.NODE_ENV !== 'production' && token === 'tokenFixo') {
        console.warn('AVISO: Utilizando token fixo. Isso deve ser removido em produção.');
        req.user = {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com'
        };
        return next();
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    req.user = decoded;
    next();
};

/**
 * Middleware para verificar se o usuário tem acesso a um recurso específico
 * baseado no ID do recurso sendo acessado
 */
const validateResourceAccess = (req, res, next) => {
    // Já deve ter passado pelo middleware authenticate
    if (!req.user) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    
    // Obter ID do recurso que está sendo acessado (da URL)
    const resourceId = parseInt(req.params.id);
    
    // Obter ID do usuário autenticado do token
    const userId = req.user.id;
    
    // Verificar se o usuário tem a função de Gestor através do campo allUserTypes
    const userRoles = req.user.allUserTypes?.split(',') || [];
    const isGestor = req.user.tipo === 'Gestor' || userRoles.includes('Gestor');
    
    // Se o ID do recurso não coincide com o ID do usuário autenticado
    // e o usuário não é um gestor, negar acesso
    if (resourceId !== userId && !isGestor) {
        return res.status(403).json({ 
            error: 'Não autorizado a acessar dados de outro usuário' 
        });
    }
    
    // Usuário está autorizado a acessar o recurso
    next();
};

/**
 * Middleware para criar uma rota protegida que só retorna dados do usuário autenticado
 * Útil para endpoints como "meu perfil" ou "minhas inscrições"
 */
const getAuthenticatedUserRoute = (controllerFunction) => {
    return async (req, res) => {
        try {
            // Define o ID do parâmetro como o ID do usuário autenticado
            req.params.id = req.user.id;
            
            // Chama o controller original com o ID correto
            await controllerFunction(req, res);
        } catch (error) {
            console.error('Erro ao processar requisição autenticada:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };
};

module.exports = {
    generateToken,
    verifyToken,
    authenticate,
    validateResourceAccess,
    getAuthenticatedUserRoute
};