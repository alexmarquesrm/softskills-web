const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendRegistrationEmail = async (email, username, password) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Bem-vindo à Plataforma SoftSkills',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #39639C;">Bem-vindo à Plataforma SoftSkills!</h2>
          <p>Olá,</p>
          <p>A sua conta foi criada com sucesso. Aqui estão os seus dados de acesso:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nome de utilizador:</strong> ${username}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p>Por motivos de segurança, recomendamos que altere a sua password após o primeiro login.</p>
          <p>Se tiver alguma dúvida, não hesite em contactar-nos.</p>
          <p>Atenciosamente,<br>Equipa SoftSkills</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

module.exports = {
  sendRegistrationEmail
}; 