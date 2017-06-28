'use strict';

var sequelize = require('../connections/db');

var models = [
  'users',
  'items'
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

(function(m) {
  m.items.belongsTo(m.users, { foreignKey: 'user_id' });
})(module.exports);

module.exports.sequelize = sequelize;
