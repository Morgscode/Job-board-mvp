const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const { htmlToText } = require('html-to-text');

const OPTIONS = Object.freeze({
  from: process.env.MAIL_FROM,
  to: '',
  subject: '',
  html: '',
  text: '',
});

const transporter = nodemailer.createTransport({
  name: process.env.SMTP_NAME,
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_KEY,
  },
  logger: true,
  debug: true,
});

class Mailer {
  constructor() {
    this.options = Object.assign({}, OPTIONS);
    this.template = '';
  }

  getOptions() {
    return this.options;
  }

  setOptions(options) {
    this.options = options;
  }

  getOption(key) {
    return this.options[key];
  }

  setOption(key, value) {
    this.options[key] = value;
  }

  resetOptions() {
    this.options = {
      from: process.env.MAIL_FROM,
      to: '',
      subject: '',
      html: '',
      text: '',
    };
    this.template = '';
  }

  renderTemplate(template, data) {
    if (!template || !data) throw new Error('Template or data not set');
    const html = pug.renderFile(
      path.join(__dirname, '..', 'emails', `${template}.pug`),
      {
        ...data,
      }
    );
    if (!html) throw new Error(`Template "${template}" could not be found`);
    this.options.html = html;
    this.options.text = htmlToText(html);
    this.template = template;
  }

  setText(text) {
    this.options.text = text;
  }

  async send() {
    await transporter.verify();
    const mail = await transporter.sendMail({ ...this.options });
    this.resetOptions();
    return mail;
  }
}

module.exports = Mailer;
