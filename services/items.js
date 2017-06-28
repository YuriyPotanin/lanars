'use strict'
const models = require('../models');
const items = models.items;
const users = models.users;
const validator = require('../helpers/validator');
const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${__dirname} /../storage`);
  },
  filename: function(req, file, cb) {

    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('file');


function createItem(req, res, next) {
  let errors;
  let item;
  const itemData = req.body;
  const specification = {
    title: {
      type: 'string',
      required: true,
      length: 3
    },
    description: {
      type: 'string',
      required: true,
      length: 3
    }
  };
  errors = validator(itemData, specification);
  if (errors) {
    res.status(errors.status);
    res.send(errors.errors);
  }
  item = {
    title: itemData.title,
    description: itemData.description,
    image: null,
    user_id: req.user.id
  };
  items.create(item).then(item => {
    item = item.dataValues;
    res.send({
      createdAt: item.createdAt.getTime(),
      description: item.description,
      id: item.id,
      image: item.image,
      title: item.title,
      user_id: item.user_id,
      user: {
        id: req.user.id,
        phone: req.user.phone,
        name: req.user.name,
        email: req.user.email,
      }
    });
  });

}

function deleteFile(link) {
  let fileName = link.split("/").pop();
  let path = `storage/${fileName}`;
  fs.unlink(path, err => {
    err && console.log(err);
  });
}

function uploudPhoto(req, res, next) {
  const itemId = req.params.id;
  let item;
  let userId;
  items.findById(itemId, {
      attributes: ["createdAt", "description", "id", "image", "title", "user_id"],
      include: [{ model: users, attributes: ['id', 'phone', 'name', 'email'], as: 'user' }]
    })
    .then(item => {
      if (!item) return res.sendStatus(404);
      userId = item.dataValues.user_id;
      item = item.dataValues;
      if (userId !== req.user.id) return res.sendStatus(403);
      if (item.image) deleteFile(item.image);
      upload(req, res, function(err) {
        if (err) return res.sendStatus(500);
        let path = `http://localhost:3000/image/${req.file.filename}`;
        items.update({ image: path }, { where: { id: itemId } })
          .then(result => {
            item.image = path;
            res.send(item);
          });

      });
    });

}

function deleteItem(req, res, next) {
  const itemId = req.params.itemId;
  items.findById(itemId).then(item => {
    if (!item) return res.sendStatus(404);
    if (item.user_id !== req.user.id) return res.sendStatus(403);
    items.destroy({ where: { id: itemId } })
      .then(itemResp => {
        res.send();
      });
  });

}

function deleteItemImage(req, res, next) {
  const itemId = req.params.itemId;
  items.findById(itemId).then(item => {
    if (!item) return res.sendStatus(404);
    if (item.user_id !== req.user.id) return res.sendStatus(403);
    deleteFile(item.image);
    items.update({ image: null }, { where: { id: itemId } })
      .then(itemResp => {
        res.send();
      });
  });

}

function updateItem(req, res, next) {
  let toUpdate = {};
  let errors;
  const itemId = req.params.itemId;
  const itemValue = req.body;
  const specification = {
    title: {
      type: 'string',
      length: 3
    },
    description: {
      type: 'string',
      length: 3
    }
  };

  if (!itemValue.title && !itemValue.description) return res.sendStatus(400);
  errors = validator(itemValue, specification);
  if (errors) {
    res.status(errors.status);
    res.send(errors.errors);
    return;
  }
  items.findById(itemId, {
    attributes: ["createdAt", "description", "id", "image", "title", "user_id"],
    include: [{ model: users, attributes: ['id', 'phone', 'name', 'email'], as: 'user' }]
  }).then(item => {
    if (!item) return res.sendStatus(404);
    if (item.user_id !== req.user.id) return res.sendStatus(403);
    Object.keys(specification).forEach(field => {
      if (itemValue[field]) {
        item[field] = itemValue[field]
        toUpdate[field] = itemValue[field];
      }
    });
    items.update(toUpdate, { where: { id: itemId } })
      .then(itemResp => {
        res.send(item);
      });
  });

}

function getItemById(req, res, next) {
  let id = req.params.itemId;
  items.findById(id, {
      attributes: ["createdAt", "description", "id", "image", "title", "user_id"],
      include: [{ model: users, attributes: ['id', 'phone', 'name', 'email'], as: 'user' }]
    })
    .then(item => {
      if (!item) res.sendStatus(404);
      res.send(item.dataValues);
    });

}

function searchItems(req, res, next) {
  const paramsForSearch = ["title", "user_id"];
  let query = {};
  paramsForSearch.forEach(field => {
    if (req.query[field]) query[field] = req.query[field];
  });
  items.findAll({
    where: query,
    order: [
      [`${req.order_by === 'title'? 'title': 'createdAt'}`, `${req.order_type && req.order_type.toUpperCase()==='ASC'?'ASC':'DESC'}`]
    ],
    attributes: ["createdAt", "description", "id", "image", "title", "user_id"],
    include: [{ model: users, attributes: ['id', 'phone', 'name', 'email'], as: 'user' }]
  }).then(items => {
    if (!items.length) return res.sendStatus(404);
    res.send(items);
  });
}
module.exports = {
  createItem: createItem,
  searchItems: searchItems,
  uploudPhoto: uploudPhoto,
  getItemById: getItemById,
  updateItem: updateItem,
  deleteItem: deleteItem,
  deleteItemImage: deleteItemImage

};
