const { DataTypes } = require('sequelize');
const sequelize = require('./../config/db_config');
const { User } = require('./user');

const Address = sequelize.define(
  'Address',
  {
    address: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

const Wilaya = sequelize.define('Wilaya', {
  wilaya: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = { Address, Wilaya };
