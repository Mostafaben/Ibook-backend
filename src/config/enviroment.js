require("dotenv").config()
const { env } = process

const port = env.PORT || 3000,
  host = env.HOST,
  db_name = env.DB_NAME,
  db_user = env.DB_USER,
  db_pass = env.DB_PASS,
  db_host = env.DB_HOST,
  token_duration = env.TOKEN_DURATION,
  token_secret = env.TOKEN_SECRET,
  refresh_token_secret = env.REFRESH_TOKEN_SECRET,
  mail_port = env.Mail_PORT,
  mail_user = env.Mail_USER,
  mail_pass = env.Mail_PASS,
  mail_host = env.Mail_HOST,
  adminName = env.ADMIN_NAME,
  adminEmail = env.ADMIN_EMAIL,
  adminPassword = env.ADMIN_PASSWORD,
  book_image_url = `${host}:${port}/api/public/resources/books/`,
  author_image_url = `${host}:${port}/api/public/resources/authors/`,
  user_image_url = `${host}:${port}/api/public/resources/users/`,
  category_image_url = `${host}:${port}/api/public/resources/categories/`

module.exports = {
  port,
  host,
  db_name,
  db_user,
  db_pass,
  db_host,
  token_duration,
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
  category_image_url,
}

/// 1dmkbGU8BN

/**
 *
 * @dbhost : 18.221.81.73
 * @dbname : ibook
 * @user : root
 * @dbport : 3306
 */
