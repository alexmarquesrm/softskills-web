const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendEmail = async (to, subject, text) => {
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
    try {
        await transporter.verify();
    } catch (error) {
        throw error;
    }

    // Configurar
    let mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: to,
        subject: subject,
        text: text,
    };

    // Envio
    try {
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
    }
};