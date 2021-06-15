const sequelize = require('./../config/db_config');
const { DataTypes } = require('sequelize');

const Author = sequelize.define(
  'Author',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    resume: { type: DataTypes.STRING },
    image_url: { type: DataTypes.STRING },
    image_path: { type: DataTypes.STRING },
    image_name: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

module.exports = { Author };
