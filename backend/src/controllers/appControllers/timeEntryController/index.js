const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');

const clockIn = require('./clockIn');
const clockOut = require('./clockOut');
const summary = require('./summary');
const approve = require('./approve');
const calculateHours = require('./calculateHours');

function modelController() {
  const Model = mongoose.model('TimeEntry');
  const methods = createCRUDController('TimeEntry');

  // Custom methods
  methods.clockIn = (req, res) => clockIn(Model, req, res);
  methods.clockOut = (req, res) => clockOut(Model, req, res);
  methods.summary = (req, res) => summary(Model, req, res);
  methods.approve = (req, res) => approve(Model, req, res);
  methods.calculateHours = (req, res) => calculateHours(Model, req, res);

  return methods;
}

module.exports = modelController();
