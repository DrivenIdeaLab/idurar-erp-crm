const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const checkAvailability = require('./checkAvailability');
const createServiceRecord = require('./createServiceRecord');
const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Appointment');
  const methods = createCRUDController('Appointment');

  // Custom methods
  methods.checkAvailability = (req, res) => checkAvailability(Model, req, res);
  methods.createServiceRecord = (req, res) => createServiceRecord(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();
