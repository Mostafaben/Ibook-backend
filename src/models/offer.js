const { DataTypes } = require('sequelize');
const sequelize = require('./../config/db_config');
const { respond_status, offer_status } = require('./../enums/enums');

const Offer = sequelize.define(
  'Offer',
  {
    offer_type: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 1,
      },
    },
    offer_status: {
      type: DataTypes.INTEGER,
      defaultValue: offer_status.ACTIVE,
    },
  },
  { timestamps: true }
);
const Offer_Sell_Respond = sequelize.define(
  'Offer_Sell_Respond',
  {
    price: { type: DataTypes.BIGINT, allowNull: false },
    respond_status: {
      type: DataTypes.INTEGER,
      defaultValue: respond_status.PENDING,
    },
  },
  { timestamps: true }
);

const Offer_Exchange_Respond = sequelize.define(
  'Offer_Exchange_Respond',
  {
    respond_status: {
      type: DataTypes.INTEGER,
      defaultValue: respond_status.PENDING,
    },
  },
  { timestamps: true }
);

const Offer_Likes = sequelize.define('Offer_Likes', {}, { timestamps: true });

module.exports = {
  Offer,
  Offer_Likes,
  Offer_Sell_Respond,
  Offer_Exchange_Respond,
};
