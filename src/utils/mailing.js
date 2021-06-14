const transporter = require('../config/mail_config');

async function sendVerificationMail(email, name, code) {
  return transporter.sendMail({
    from: 'fm_benlagha@esi.dz',
    to: email,
    subject: `${name}, Accout validation`,
    text: code,
    sender: 'Ibook Website',
  });
}

module.exports = { sendVerificationMail };
