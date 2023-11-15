module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("data_neighbors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ip_neighbor: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      neighbor: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      red: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ip_switch: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      interface: {
        type: Sequelize.STRING(100),
        allowNull: false,
      }
    });

    await queryInterface.createTable("interfaces", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(225),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      id_prtg: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      ip_switch: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name_switch: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      red: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
    });

    await queryInterface.createTable("neighbors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ip_neighbor: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      neighbor: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      red: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      ip_switch: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      interface: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(10),
        allowNull: false,
      }
    });

    await queryInterface.createTable("route_default", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      via_bgp: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      red: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      ip_switch: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
    });

    await queryInterface.createTable("system_health", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      lastvalue: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      id_prtg: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      ip_switch: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      name_switch: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      red: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("data_neighbors");
    await queryInterface.dropTable("interfaces");
    await queryInterface.dropTable("neighbors");
    await queryInterface.dropTable("route_default");
    await queryInterface.dropTable("system_health");
  },
};
