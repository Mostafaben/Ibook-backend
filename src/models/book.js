const sequelize = require('./../config/db_config');
const { DataTypes } = require('sequelize');
const { book_state } = require('../enums/enums');

const Book = sequelize.define(
  'Book',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    etat: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      validate: {
        min: 0,
        max: 10,
      },
    },
    state: {
      type: DataTypes.INTEGER,
      defaultValue: book_state.AVAILABLE,
    },
    summary: {
      type: DataTypes.TEXT,
    },
  },
  { timestamps: true }
);

const Book_Images = sequelize.define('Book_Images', {
  image_path: { type: DataTypes.STRING, allowNull: false },
  image_name: { type: DataTypes.STRING, allowNull: false },
  image_url: { type: DataTypes.STRING, allowNull: false },
});

module.exports = { Book, Book_Images };
