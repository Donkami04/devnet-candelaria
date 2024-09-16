const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const Dockers = sequelize.define(
  "Dockers",
  {
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cpu_usage_percent: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    memory_usage: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    memory_limit: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "docker_containers",
    timestamps: false,
  }
);

module.exports = { Dockers }