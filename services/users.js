'use strict'
const models = require('../models');
const users = models.users;
const validator = require('../helpers/validator');
const auth = require('../helpers/auth');

function createUser(req, res, next) {
  let errors;
  const userData = req.body;
  const specification = {
    phone: {
      type: 'string',
      required: true,
      length: 3
    },
    name: {
      type: 'string',
      required: true,
      length: 3
    },
    email: {
      type: 'string',
      required: true,
      length: 3
    },
    password: {
      type: 'string',
      required: true,
      length: 3
    }
  };
  errors = validator(userData, specification);
  if (errors) {
    res.status(errors.status);
    res.send(errors.errors);
    return;
  }
  users.findOne({ where: { name: userData.name } }).then(user => {
    if (!user) {
      users.create({
        phone: userData.phone,
        name: userData.name,
        email: userData.email,
        password: userData.password
      }).then(user => {
        user = user.dataValues;
        let token = auth.generateToken(user.id);
        res.send({
          token: token
        });
        return;
      });
    } else {
      res.status(422);
      res.send([{ field: 'name', message: `User with username ${userData.name} already exist` }]);

    }
  });
}

function login(req, res, next) {
  if (req.body.name && req.body.password) {
    let { name, password } = req.body;
    users.findOne({ where: { name, password } })
      .then(user => {
        if (user) {
          user = user.dataValues;
          var token = auth.generateToken(user.id);
          res.send({
            token: token
          });
          return;
        } else {
          res.status(403);
          res.send([{ field: 'password', message: "Wrong email or password" }]);

        }
      });
  } else {
    res.sendStatus(401);
    return;
  }
}

function getMyProfile(req, res, next) {

  let user = {
    id: req.user.id,
    phone: req.user.phone,
    name: req.user.name,
    email: req.user.email
  };
  res.send(user);
}

function updateMyprofile(req, res, next) {
  let errors;
  let toUpdate = {};
  const userValue = req.body;
  const specification = {
    phone: {
      type: 'string',
      length: 3
    },
    name: {
      type: 'string',
      length: 3
    },
    email: {
      type: 'string',
      length: 3
    },
    new_password: {
      type: 'string',
      required: true,
      length: 3
    }
  };
  if (!userValue.current_password) delete specification.new_password;
  errors = validator(userValue, specification);
  if (errors) {
    res.status(errors.status);
    res.send(errors.errors);
    return;
  }
  if (userValue.current_password && req.user.password !== userValue.current_password) {
    res.status(422);
    res.send([{ field: "current_password", message: "Wrong current password" }]);
    return;
  }
  if (userValue.new_password && !userValue.current_password) {
    res.status(422);
    res.send([{ field: "current_password", message: "Wrong current password" }]);
    return;
  }

  Object.keys(specification).forEach(field => {
    if (field === "new_password" && userValue.new_password) {
      toUpdate.password = userValue.new_password;
    }
    if (userValue[field] && field !== "new_password") {
      toUpdate[field] = userValue[field];
    }
  });
  users.update(toUpdate, { where: { id: req.user.id } })
    .then(user => {
      delete toUpdate.password;
      res.send(toUpdate);
    });
}

function getUserById(req, res, next) {
  let id = req.params.userId;
  users.findById(id, { attributes: ['id', 'phone', 'name', 'email'] })
    .then(user => {
      if (!user) return res.sendStatus(404);
      res.send(user.dataValues);
    });

}

function searchUsers(req, res, next) {
  const paramsForSearch = ["name", "email"];
  let query = {};
  paramsForSearch.forEach(field => {
    if (req.query[field]) query[field] = req.query[field];
  });
  users.findAll({
    where: query,
    attributes: ['id', 'phone', 'name', 'email']
  }).then(users => {
    if (!users.length) return res.sendStatus(404);
    res.send(users);
  });
}
module.exports = {
  createUser: createUser,
  login: login,
  getMyProfile: getMyProfile,
  updateMyprofile: updateMyprofile,
  getUserById: getUserById,
  searchUsers: searchUsers
};
