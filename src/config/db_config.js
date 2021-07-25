const { Sequelize } = require("sequelize")
const { db_name, db_host, db_pass, db_user } = require("./../config/enviroment")

const sequelize = new Sequelize(db_name, db_user, db_pass, {
  dialect: "mysql",
  host: db_host,
})

module.exports = sequelize
