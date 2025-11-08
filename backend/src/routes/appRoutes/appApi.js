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
};

routesList.forEach(({ entity, controllerName }) => {
  const controller = appControllers[controllerName];
  routerApp(entity, controller);
});

module.exports = router;
