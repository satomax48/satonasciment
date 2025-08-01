require('dotenv').config();
const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.post('/enviar-comprovante', upload.single('arquivo'), async (req, res) => {
  const { prazo, email } = req.body;
  const file = req.file;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Recebemos seu comprovante!',
      text: `Prazo solicitado: ${prazo}`,
      attachments: file ? [{ filename: file.originalname, path: file.path }] : []
    });
    res.redirect('/sucesso.html');
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    res.status(500).send('Erro ao enviar o comprovante.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
