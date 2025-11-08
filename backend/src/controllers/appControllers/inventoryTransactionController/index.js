const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const recordTransaction = require('./recordTransaction');
const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('InventoryTransaction');
  const methods = createCRUDController('InventoryTransaction');

  // Custom methods
  methods.recordTransaction = (req, res) => recordTransaction(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();
