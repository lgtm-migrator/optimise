/**
 * Route visit.
 * @description Redirect request from /visits to the proper controller call
 */


const express = require('express');
const visit = express();

const VisitController = require('../controllers/visitController');
const VisitCtrl = new VisitController();

visit.route('/')
    .get(VisitCtrl.getVisitsOfPatient)
    .post(VisitCtrl.createVisit)
    .put(VisitCtrl.updateVisit)
    .delete(VisitCtrl.deleteVisit);

module.exports = visit;
