const sequelize = require('./../config/db_config');
const { DataTypes } = require('sequelize');
const { user_role } = require('../enums/enums');

const User = sequelize.define(
  'User',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        max: 1,
      },
      defaultValue: user_role.USER,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { timestamps: true }
);

const User_Image = sequelize.define(
  'User_Image',
  {
    image_path: { type: DataTypes.STRING, allowNull: false },
    image_name: { type: DataTypes.STRING, allowNull: false },
    image_url: { type: DataTypes.STRING, allowNull: false },
  },
  { timestamps: true }
);

const User_Validation = sequelize.define(
  'User_Validation',
  { code: { type: DataTypes.STRING, allowNull: false } },
  { timestamps: true }
);

const User_Reset_Password = sequelize.define(
  'User_Rest_Password',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

User_Validation.belongsTo(User);
User_Image.belongsTo(User);
User.hasMany(User_Image);

module.exports = { User, User_Image, User_Validation, User_Reset_Password };
