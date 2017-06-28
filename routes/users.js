'use strict'
const userService = require('../services/index').users;
const auth = require('../helpers/auth');


module.exports = function(app) {

  app.post('/api/register', userService.createUser);
  app.post('/api/login', userService.login);
  app.use(auth.verify);
  app.get('/api/my', userService.getMyProfile);
  app.put('/api/my', userService.updateMyprofile);
  app.get('/api/user/:userId', userService.getUserById);
  app.get('/api/user', userService.searchUsers);


};
