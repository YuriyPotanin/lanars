'use strict'
const models = require('../models'),
  config = require('../cnfg').auth,
  users = models.users,
  jwt = require('jsonwebtoken');


function generateToken(userId) {
  return jwt.sign(userId, config.secret);
}

function verify(req, res, next) {
  try {
    const token = req.headers.authorization;
    let id = jwt.verify(token, config.secret);
    users.findById(id)
      .then(user => {
        if (user) {
          req.user = user.dataValues;
          next();
        } else {
          res.status(401);

          return;
        }
      });
  } catch (err) {
    res.sendStatus(401);
    return;
  }
}
module.exports = {
  generateToken: generateToken,
  verify: verify
};
