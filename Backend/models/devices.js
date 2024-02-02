const sequelize = require("../db/conection");
const { Sequelize, DataTypes } = require("sequelize");

const Devices = sequelize.define(
  "Devices",
  {
    host: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    site: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    dpto: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    prtg_name_device: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    prtg_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    prtg_sensorname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    prtg_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    prtg_lastup: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    prtg_lastdown: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cisco_device_ip: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cisco_device_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cisco_port: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    cisco_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cisco_status_device: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    cisco_mac_address: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    data_backup: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    red: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    cctv_enabled: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    cctv_valid: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: "devices",
    timestamps: false,
  }
);

module.exports = { Devices };
