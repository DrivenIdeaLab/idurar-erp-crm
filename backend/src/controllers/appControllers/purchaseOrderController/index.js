const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const receive = require('./receive');
const summary = require('./summary');
const updateStatus = require('./updateStatus');

function modelController() {
  const Model = mongoose.model('PurchaseOrder');
  const methods = createCRUDController('PurchaseOrder');

  // Custom methods
  methods.receive = (req, res) => receive(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.updateStatus = (req, res) => updateStatus(Model, req, res);

  return methods;
}

module.exports = modelController();
