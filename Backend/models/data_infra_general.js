const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const DataInfGen = sequelize.define(
  "DataInfGen",
  {
    ip: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rol: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    name_switch: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    red: {
      type: DataTypes.STRING(10),
      allowNull: true,
    }
  },
  {
    tableName: "data_inf_gen",
    timestamps: false,
  }
);

module.exports = { DataInfGen };