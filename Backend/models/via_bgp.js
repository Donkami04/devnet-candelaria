const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const ViaBgp= sequelize.define(
  "ViaBgp",
  {
    via_bgp: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    red : {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    ip_switch: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  },
  {
    tableName: "via_bgp",
    timestamps: false,
  }
);

module.exports = { ViaBgp };