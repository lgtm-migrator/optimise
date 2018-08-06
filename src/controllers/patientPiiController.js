const PatientPiiCore = require('../core/patientPii');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');

const PatientPiiModel = {
    'patient': 0,
    'firstName': '',
    'surname': '',
    'fullAddress': '',
    'postcode': ''
};

function PatientPiiController() {
    this.patientPii = new PatientPiiCore();

    this.getPatientPii = PatientPiiController.prototype.getPatientPii.bind(this);
    this.createPatientPii = PatientPiiController.prototype.createPatientPii.bind(this);
    this.updatePatientPii = PatientPiiController.prototype.updatePatientPii.bind(this);
    this.deletePatientPii = PatientPiiController.prototype.deletePatientPii.bind(this);
}

PatientPiiController.prototype.getPatientPii = function (req, res) {
    if (req.query.hasOwnProperty('patient')) {
        this.patientPii.getPatientPii({ 'patient': parseInt(req.query.patient), 'deleted': '-' }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return false;
        });
    } else {
        this.patientPii.getPatientPii({}).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(messages.errorMessages.GETFAIL, error));
            return false;
        });
    }
};

PatientPiiController.prototype.createPatientPii = function (req, res) {
    if (req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('firstName') && req.body.hasOwnProperty('surname') && req.body.hasOwnProperty('fullAddress') && req.body.hasOwnProperty('postcode') &&
        typeof req.body.patient === 'number' && typeof req.body.firstName === 'string' && typeof req.body.surname === 'string' && typeof req.body.fullAddress === 'string' && typeof req.body.postcode === 'string') {
        let entryObj = Object.assign({}, PatientPiiModel, req.body);
        entryObj.createdByUser = req.user.id;
        this.patientPii.createPatientPii(entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(messages.errorMessages.CREATIONFAIL, error));
            return false;
        });
    } else if (!(req.body.hasOwnProperty('patient') && req.body.hasOwnProperty('firstName') && req.body.hasOwnProperty('surname') && req.body.hasOwnProperty('fullAddress') && req.body.hasOwnProperty('postcode'))) {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
        return;
    }
};

PatientPiiController.prototype.updatePatientPii = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        let entryObj = req.body;
        entryObj.createdByUser = req.user.id;
        this.patientPii.updatePatientPii(req.user, req.body.id, entryObj).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(messages.errorMessages.UPDATEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
        return;
    }
};

PatientPiiController.prototype.deletePatientPii = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {
        this.patientPii.deletePatientPii(req.user, { 'id': req.body.id }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(messages.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(messages.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(messages.userError.WRONGARGUMENTS));
        return;
    }
};

module.exports = PatientPiiController;