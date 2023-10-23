const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const Neighbors= sequelize.define(
  "Neighbors",
  {
    ip_neighbor: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    neighbor: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    red: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    ip_switch: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  },
  {
    tableName: "neighbors",
    timestamps: false,
  }
);

module.exports = { Neighbors };