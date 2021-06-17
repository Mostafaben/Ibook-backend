const { DataTypes } = require('sequelize'),
  sequelize = require('./../config/db_config');

const Category = sequelize.define(
  'Category',
  {
    name: { type: DataTypes.STRING, unique: true },
  },
  { timestamps: true }
);

const Category_Image = sequelize.define(
  'Category_Image',
  {
    icon_path: { type: DataTypes.STRING, allowNull: false },
    icon_name: { type: DataTypes.STRING, allowNull: false },
    icon_url: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

module.exports = { Category, Category_Image };
