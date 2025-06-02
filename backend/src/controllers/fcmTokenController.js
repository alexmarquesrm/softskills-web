const Colaborador = require('../models/colaborador');

// Verificar se o token atual é válido
exports.verificarToken = async (req, res) => {
    try {
        const { colaboradorId } = req.params;
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ 
                success: false, 
                message: 'Token não fornecido' 
            });
        }

        // Verifica se o colaboradorId da rota corresponde ao do token JWT
        if (req.user.colaborador_id !== parseInt(colaboradorId)) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado a verificar este token'
            });
        }

        const colaborador = await Colaborador.findByPk(colaboradorId);
        if (!colaborador) {
            return res.status(404).json({
                success: false,
                message: 'Colaborador não encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            tokenValido: colaborador.fcmtoken === token
        });

    } catch (error) {
        console.error('Erro ao verificar token:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao verificar token'
        });
    }
};

// Registrar novo token
exports.registrarToken = async (req, res) => {
    try {
        const { colaboradorId, token, deviceInfo } = req.body;

        if (!colaboradorId || !token) {
            return res.status(400).json({
                success: false,
                message: 'ColaboradorId e token são obrigatórios'
            });
        }

        // Verifica se o colaboradorId do body corresponde ao do token JWT
        if (req.user.colaborador_id !== parseInt(colaboradorId)) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado a registrar token para este colaborador'
            });
        }

        const colaborador = await Colaborador.findByPk(colaboradorId);
        if (!colaborador) {
            return res.status(404).json({
                success: false,
                message: 'Colaborador não encontrado'
            });
        }

        // Atualiza o token FCM do colaborador
        colaborador.fcmtoken = token;
        await colaborador.save();

        return res.status(200).json({
            success: true,
            message: 'Token registrado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao registrar token:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao registrar token'
        });
    }
};

// Desativar token
exports.desativarToken = async (req, res) => {
    try {
        const { colaboradorId } = req.body;

        if (!colaboradorId) {
            return res.status(400).json({
                success: false,
                message: 'ColaboradorId é obrigatório'
            });
        }

        // Verifica se o colaboradorId do body corresponde ao do token JWT
        if (req.user.colaborador_id !== parseInt(colaboradorId)) {
            return res.status(403).json({
                success: false,
                message: 'Não autorizado a desativar token deste colaborador'
            });
        }

        const colaborador = await Colaborador.findByPk(colaboradorId);
        if (!colaborador) {
            return res.status(404).json({
                success: false,
                message: 'Colaborador não encontrado'
            });
        }

        // Remove o token FCM do colaborador
        colaborador.fcmtoken = null;
        await colaborador.save();

        return res.status(200).json({
            success: true,
            message: 'Token desativado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao desativar token:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao desativar token'
        });
    }
}; 