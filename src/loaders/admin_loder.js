const {
  adminEmail,
  adminName,
  adminPassword,
} = require('../config/enviroment');
const { user_role } = require('../enums/enums');
const { User } = require('./../models/models');
const { hashPassword } = require('./../utils/passwordsHandler');

async function createAdmin() {
  if (await checkDefaultAdmin()) throw Error('default admin already exist');
  return User.create({
    name: adminName,
    password: hashPassword(adminPassword),
    email: adminEmail,
    role: user_role.ADMIN,
  });
}

async function checkDefaultAdmin() {
  return User.findOne({ where: { role: user_role.ADMIN, email: adminEmail } });
}

module.exports = { createAdmin };
