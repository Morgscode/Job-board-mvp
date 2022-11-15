const nodemailer = require('nodemailer');
const path = require('path');

const OPTIONS = Object.freeze({
    from: process.env.MAIL_FROM,
    to: '',
    subject: '',
    template: '',
    html: '',
});

const transporter = nodemailer.createTransport({
  name: process.env.SMTP_NAME,
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_MASTER_PASS,
  },
  logger: true,
  debug: true,
});

let options = {...OPTIONS};

async function send() {
  await transporter.verify();
  const mail = await transporter.sendMail(options);
  options = {...OPTIONS};
  return mail;
}

module.exports = { send, options };
