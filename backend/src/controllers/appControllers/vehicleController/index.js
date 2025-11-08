const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const decodeVin = require('./decodeVin');
const summary = require('./summary');
const updateMileage = require('./updateMileage');

function modelController() {
  const Model = mongoose.model('Vehicle');
  const methods = createCRUDController('Vehicle');

  // Custom methods
  methods.decodeVin = (req, res) => decodeVin(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.updateMileage = (req, res) => updateMileage(Model, req, res);

  return methods;
}

module.exports = modelController();
