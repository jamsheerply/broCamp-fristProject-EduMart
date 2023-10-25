const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'safatedumartpayyoli@gmail.com',
      pass: 'uzky uzdu vswi pupe',
    },
  });
  transporter.verify().then(console.log).catch(console.error);