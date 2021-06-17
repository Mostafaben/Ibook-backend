const { DataTypes } = require('sequelize/types'),
  sequelize = require('../config/db_config'),
  { file_types } = require('../enums/enums');

const File = sequelize.define(
  'File',
  {
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM(...file_types) },
  },
  { timestamps: true }
);

const FileUrl = sequelize.define('FileUrl', {
  file_url: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { File, FileUrl };
