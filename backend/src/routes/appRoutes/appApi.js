const express = require('express');
const { catchErrors } = require('@/handlers/errorHandlers');
const router = express.Router();

const appControllers = require('@/controllers/appControllers');
const { routesList } = require('@/models/utils');

const routerApp = (entity, controller) => {
  router.route(`/${entity}/create`).post(catchErrors(controller['create']));
  router.route(`/${entity}/read/:id`).get(catchErrors(controller['read']));
  router.route(`/${entity}/update/:id`).patch(catchErrors(controller['update']));
  router.route(`/${entity}/delete/:id`).delete(catchErrors(controller['delete']));
  router.route(`/${entity}/search`).get(catchErrors(controller['search']));
  router.route(`/${entity}/list`).get(catchErrors(controller['list']));
  router.route(`/${entity}/listAll`).get(catchErrors(controller['listAll']));
  router.route(`/${entity}/filter`).get(catchErrors(controller['filter']));
  router.route(`/${entity}/summary`).get(catchErrors(controller['summary']));

  if (entity === 'invoice' || entity === 'quote' || entity === 'payment') {
    router.route(`/${entity}/mail`).post(catchErrors(controller['mail']));
  }

  if (entity === 'quote') {
    router.route(`/${entity}/convert/:id`).get(catchErrors(controller['convert']));
  }

  if (entity === 'vehicle') {
    router.route(`/${entity}/decode-vin`).post(catchErrors(controller['decodeVin']));
    router.route(`/${entity}/update-mileage/:id`).post(catchErrors(controller['updateMileage']));
  }

  if (entity === 'servicerecord') {
    router
      .route(`/${entity}/convert-to-invoice/:id`)
      .post(catchErrors(controller['convertToInvoice']));
    router.route(`/${entity}/update-status/:id`).post(catchErrors(controller['updateStatus']));
  }

  if (entity === 'appointment') {
    router.route(`/${entity}/check-availability`).get(catchErrors(controller['checkAvailability']));
    router
      .route(`/${entity}/create-service-record/:id`)
      .post(catchErrors(controller['createServiceRecord']));
  }

  if (entity === 'part') {
    router.route(`/${entity}/check-stock`).get(catchErrors(controller['checkStock']));
    router.route(`/${entity}/adjust-stock/:id`).post(catchErrors(controller['adjustStock']));
    router.route(`/${entity}/reorder`).get(catchErrors(controller['reorder']));
  }

  if (entity === 'inventorytransaction') {
    router
      .route(`/${entity}/record-transaction`)
      .post(catchErrors(controller['recordTransaction']));
  }

  if (entity === 'purchaseorder') {
    router.route(`/${entity}/receive/:id`).post(catchErrors(controller['receive']));
    router.route(`/${entity}/update-status/:id`).post(catchErrors(controller['updateStatus']));
  }

  if (entity === 'supplier') {
    router.route(`/${entity}/performance/:id`).get(catchErrors(controller['performance']));
  }

  if (entity === 'timeentry') {
    router.route(`/${entity}/clock-in`).post(catchErrors(controller['clockIn']));
    router.route(`/${entity}/clock-out`).post(catchErrors(controller['clockOut']));
    router.route(`/${entity}/approve/:id`).post(catchErrors(controller['approve']));
    router.route(`/${entity}/calculate-hours`).get(catchErrors(controller['calculateHours']));
  }

  if (entity === 'certification') {
    router.route(`/${entity}/expiring`).get(catchErrors(controller['expiring']));
    router.route(`/${entity}/renew/:id`).post(catchErrors(controller['renew']));
  }

  if (entity === 'employee') {
    router.route(`/${entity}/performance/:id`).get(catchErrors(controller['performance']));
    router.route(`/${entity}/update-performance/:id`).post(catchErrors(controller['updatePerformance']));
  }
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

// Analytics routes with rate limiting
const analyticsController = require('@/controllers/appControllers/analyticsController');
const { analyticsRateLimiter } = require('@/middlewares/rateLimiter');
const { sanitizeQuery } = require('@/middlewares/inputValidation');

router.route('/analytics/executive-dashboard').get(
  analyticsRateLimiter,
  sanitizeQuery,
  catchErrors(analyticsController.executiveDashboard)
);
router.route('/analytics/advisor-dashboard').get(
  analyticsRateLimiter,
  sanitizeQuery,
  catchErrors(analyticsController.serviceAdvisorDashboard)
);
router.route('/analytics/financial-report').get(
  analyticsRateLimiter,
  sanitizeQuery,
  catchErrors(analyticsController.financialReport)
);

module.exports = router;
