'use strict'
const Sequelize = require('sequelize'),
  config = require("../cnfg").db;

const sequelize = new Sequelize(config.name, config.username, config.password, {
  host: 'localhost',
  dialect: 'mysql',
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = sequelize;
