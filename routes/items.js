'use strict'
const itemService = require('../services/index').items;
const auth = require('../helpers/auth')


module.exports = function(app) {

  app.post('/api/item', itemService.createItem);
  app.get('/api/item', itemService.searchItems);
  app.post('/api/item/:id/image', itemService.uploudPhoto);
  app.get('/api/item/:itemId', itemService.getItemById);
  app.put('/api/item/:itemId', itemService.updateItem);
  app.delete('/api/item/:itemId', itemService.deleteItem);
  app.delete('/api/item/:itemId/image', itemService.deleteItemImage);



};
