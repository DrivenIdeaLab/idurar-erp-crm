const executiveDashboard = require('./executiveDashboard');
const serviceAdvisorDashboard = require('./serviceAdvisorDashboard');
const financialReport = require('./financialReport');

function analyticsController() {
  const methods = {
    executiveDashboard: (req, res) => executiveDashboard(req, res),
    serviceAdvisorDashboard: (req, res) => serviceAdvisorDashboard(req, res),
    financialReport: (req, res) => financialReport(req, res),
  };

  return methods;
}

module.exports = analyticsController();
