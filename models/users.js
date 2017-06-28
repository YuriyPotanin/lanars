'use strict'
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    phone: { type: DataTypes.STRING, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
  }, {
    instanceMethods: {
      countTasks: function() {

      }
    }
  });
};
//for generate migrations from CLI
// sequelize model:create --users --attributes phon:string,name:string,email:string, password:string
