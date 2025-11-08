const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const checkStock = require('./checkStock');
const adjustStock = require('./adjustStock');
const reorder = require('./reorder');
const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Part');
  const methods = createCRUDController('Part');

  // Custom methods
  methods.checkStock = (req, res) => checkStock(Model, req, res);
  methods.adjustStock = (req, res) => adjustStock(Model, req, res);
  methods.reorder = (req, res) => reorder(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();
