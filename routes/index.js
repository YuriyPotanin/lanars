'use strict'

module.exports = function(app) {
  return {
    users: require('./users')(app),
    items: require('./items')(app)
  };
};
