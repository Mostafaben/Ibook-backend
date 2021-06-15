require('dotenv').config();

const port = process.env.PORT;
const host = process.env.HOST;
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_host = process.env.DB_HOST;
const token_durration = process.env.TOKEN_DURRATION;
const token_secret = process.env.TOKEN_SECRET;
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;
const book_image_url = `${host}:${port}/api/public/books/`;
const author_image_url = `${host}:${port}/api/public/authors/`;
const user_image_url = `${host}:${port}/api/public/users/`;
const mail_port = process.env.Mail_;
const mail_user = process.env.Mail_;
const mail_pass = process.env.Mail_;
const mail_host = process.env.Mail_;
const adminName = process.env.ADMIN_NAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

module.exports = {
  port,
  host,
  db_name,
  db_user,
  db_pass,
  db_host,
  token_durration,
  refresh_token_secret,
  token_secret,
  book_image_url,
  user_image_url,
  mail_host,
  mail_port,
  mail_user,
  mail_pass,
  author_image_url,
  adminEmail,
  adminName,
  adminPassword,
};
