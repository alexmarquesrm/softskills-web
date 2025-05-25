const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async (to, subject, text) => {
    console.log('=== INÍCIO DO ENVIO DE EMAIL ===');
    console.log('Configurações SMTP:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPass: !!process.env.SMTP_PASS,
        sender: process.env.EMAIL_SENDER
    });

    // Criar transporter 
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

    // Verificar a conexão com o servidor SMTP
    console.log('Verificando conexão com o servidor SMTP...');
    try {
        await transporter.verify();
        console.log('Conexão SMTP verificada com sucesso!');
    } catch (error) {
        console.error('Erro ao verificar conexão SMTP:', error);
        throw error;
    }

    // Configurar
    let mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to,
        subject: subject,
        text: text,
    };

    console.log('Opções do email:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject,
        textLength: mailOptions.text.length
    });

    // Envio
    try {
        console.log('Iniciando envio do email...');
        let info = await transporter.sendMail(mailOptions);
        console.log('Email enviado com sucesso!');
        console.log('ID da mensagem:', info.messageId);
        console.log('Resposta do servidor:', info.response);
        return true;
    } catch (error) {
        console.error('Erro detalhado ao enviar email:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode,
            stack: error.stack
        });
        return false;
    } finally {
        console.log('=== FIM DO ENVIO DE EMAIL ===');
    }
};