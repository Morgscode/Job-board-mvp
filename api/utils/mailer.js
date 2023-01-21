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

let options = Object.assign({}, OPTIONS);

async function send() {
  await transporter.verify();
  const mail = await transporter.sendMail({ ...options });
  return mail;
}

class Mailer {
  constructor() {
    this.options = {
      from: process.env.MAIL_FROM,
      to: '',
      subject: '',
      html: '',
      text: '',
    };
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
    return (this.options = {
      from: process.env.MAIL_FROM,
      to: '',
      subject: '',
      html: '',
      text: '',
    });
  }

  // load template
  renderTemplate(template, data) {
    // validate template
    if (!template || !data) throw new Error('Template or data not set');
    const html = pug.renderFile(
      path.join(__dirname, '..', 'emails', `${template}.pug`),
      {
        ...data,
      }
    );
    if (!html) throw new Error(`Template "${template}" could not be found`);
    // render template to string
    this.options.html = html;
    this.options.text = htmlToText(html);
    this.template = template;
    // set optiosn html
  }

  setText(text) {
    this.options.text = text;
  }

  // send email
  async send() {
    // define options
    await transporter.verify();
    // send mail
    const mail = await transporter.sendMail({ ...this.options });
    this.resetOptions();
    return mail;
  }
}

module.exports = { send, options, Mailer };
