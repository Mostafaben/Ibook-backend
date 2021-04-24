const transporter = require('../config/mail_config');

async function sendVerificationMail(email, name, code) {
  return await transporter.sendMail({
    from: 'fm_benlagha@esi.dz',
    to: email,
    subject: 'Accout validation',
    text: code,
    sender: 'Ibook',
  });
}

module.exports = { sendVerificationMail };
