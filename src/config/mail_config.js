const nodemailer = require('nodemailer');
const { mail_host, mail_pass, mail_port, mail_user } = require('./enviroment');

const transporter = nodemailer.createTransport({
  host: mail_host,
  port: mail_port,
  secure: false,
  auth: { user: mail_user, pass: mail_pass },
});

module.exports = transporter;
