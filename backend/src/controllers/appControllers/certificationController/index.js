const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const expiring = require('./expiring');
const renew = require('./renew');
const summary = require('./summary');

function modelController() {
  const Model = mongoose.model('Certification');
  const methods = createCRUDController('Certification');

  // Custom methods
  methods.expiring = (req, res) => expiring(Model, req, res);
  methods.renew = (req, res) => renew(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);

  return methods;
}

module.exports = modelController();
