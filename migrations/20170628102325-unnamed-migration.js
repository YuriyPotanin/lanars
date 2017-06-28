'use strict';

module.exports = {
  up: function(queryInterface, Sequelize) {
    queryInterface.createTable(
      'items', {
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
        title: { type: Sequelize.STRING, allowNull: true },
        description: { type: Sequelize.STRING, allowNull: true },
        image: { type: Sequelize.STRING, allowNull: true },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
      }
    );
  },

  down: function(queryInterface, Sequelize) {
    queryInterface.dropTable('items');
  }
};
