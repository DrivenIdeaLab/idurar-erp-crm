const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const summary = require('./summary');
const convertToInvoice = require('./convertToInvoice');
const updateStatus = require('./updateStatus');

function modelController() {
  const Model = mongoose.model('ServiceRecord');
  const methods = createCRUDController('ServiceRecord');

  // Custom methods
  methods.summary = (req, res) => summary(Model, req, res);
  methods.convertToInvoice = (req, res) => convertToInvoice(Model, req, res);
  methods.updateStatus = (req, res) => updateStatus(Model, req, res);

  return methods;
}

module.exports = modelController();
