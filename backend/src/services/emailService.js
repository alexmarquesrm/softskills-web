const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async (to, subject, text) => {
    console.log('=== INÍCIO DO PROCESSO DE ENVIO DE EMAIL ===');
    console.log('Destinatário:', to);
    console.log('Assunto:', subject);
    
    // Log das configurações SMTP
    console.log('Configurações SMTP:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    });

    // Verificar se todas as variáveis de ambiente necessárias estão definidas
    const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'EMAIL_SENDER'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        console.error('Variáveis de ambiente faltando:', missingVars);
        return false;
    }

    // Criar transporter 
    console.log('Criando transporter Nodemailer...');
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        debug: true, // Habilitar logs de debug
        logger: true // Habilitar logs do nodemailer
    });

    // Configurar
    console.log('Configurando opções do email...');
    let mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to,
        subject: subject,
        text: text,
    };

    // Envio
    try {
        console.log('Tentando enviar email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
        console.log('Detalhes do envio:', {
            messageId: info.messageId,
            response: info.response,
            accepted: info.accepted,
            rejected: info.rejected
        });
        return true;
    } catch (error) {
        console.error('=== ERRO NO ENVIO DE EMAIL ===');
        console.error('Erro detalhado:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack
        });
        
        // Log específico para erros de autenticação
        if (error.code === 'EAUTH') {
            console.error('Erro de autenticação SMTP. Verifique:');
            console.error('1. Se as credenciais estão corretas');
            console.error('2. Se a conta tem "Acesso a apps menos seguros" habilitado');
            console.error('3. Se está usando senha de app (caso tenha 2FA ativado)');
        }
        
        return false;
    } finally {
        console.log('=== FIM DO PROCESSO DE ENVIO DE EMAIL ===\n');
    }
};