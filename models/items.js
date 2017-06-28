'use strict'
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('items', {
    title: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true },
    user_id: { type: DataTypes.STRING, allowNull: true },
  }, {
    instanceMethods: {
      countTasks: function() {

      }
    }
  });
};
