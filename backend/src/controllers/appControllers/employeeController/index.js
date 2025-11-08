const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const performance = require('./performance');
const summary = require('./summary');
const updatePerformance = require('./updatePerformance');

function modelController() {
  const Model = mongoose.model('Employee');
  const methods = createCRUDController('Employee');

  // Custom methods
  methods.performance = (req, res) => performance(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.updatePerformance = (req, res) => updatePerformance(Model, req, res);

  return methods;
}

module.exports = modelController();
