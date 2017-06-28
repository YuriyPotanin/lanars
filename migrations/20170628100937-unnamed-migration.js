'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'users', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
        phone: { type: Sequelize.STRING, allowNull: true },
        name: { type: Sequelize.STRING, allowNull: true },
        email: { type: Sequelize.STRING, allowNull: true },
        password: { type: Sequelize.STRING, allowNull: true },
      });
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('users');
  }
};
