const SelectorUtils = require('../utils/selector-utils');
const PatientCore = require('../core/patient');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { getEntry, eraseEntry } = require('../utils/controller-utils');
const formatToJSON = require('../utils/format-response');

function PatientController() {
    this.patient = new PatientCore();

    this.searchPatients = PatientController.prototype.searchPatients.bind(this);
    this.createPatient = PatientController.prototype.createPatient.bind(this);
    this.deletePatient = PatientController.prototype.deletePatient.bind(this);
    this.getPatientProfileById = PatientController.prototype.getPatientProfileById.bind(this);
    this.updatePatient = PatientController.prototype.updatePatient.bind(this);
    this.erasePatient = PatientController.prototype.erasePatient.bind(this);
}

PatientController.prototype.searchPatients = function (req, res) {  //get all list of patient if no query string; get similar if querystring is provided
    if (Object.keys(req.query).length > 2) {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return;
    }
    let queryfield = '';
    let queryvalue = '%';
    if (typeof req.query.field === 'string')
        queryfield = req.query.field;
    else if (req.query.field !== undefined) {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return;
    }
    if (typeof req.query.value === 'string')
        queryvalue = `%${req.query.value}%`;
    else if (req.query.value !== undefined) {
        res.status(400).json(ErrorHelper(message.userError.INVALIDQUERY));
        return;
    }
    this.patient.searchPatients(queryfield, queryvalue).then(function (result) {
        result.forEach((__unused__r, i) => { result[i].uuid = undefined; });
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
        return;
    });
};

PatientController.prototype.createPatient = function (req, res) {
    if (req.body.hasOwnProperty('aliasId') && req.body.hasOwnProperty('study') && req.body.hasOwnProperty('consent')) {
        let entryObj = {
            aliasId: req.body.aliasId,
            study: req.body.study,
            createdByUser: req.user.id,
            consent: req.body.consent
        };
        this.patient.createPatient(entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(error));
            return;
        });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.updatePatient = function (req, res) {
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    this.patient.updatePatient(req.user, req.body).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return;
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
    });
};

PatientController.prototype.deletePatient = function (req, res) {
    if (req.user.priv === 1 && req.body.hasOwnProperty('aliasId')) {
        this.patient.deletePatient(req.user, { aliasId: req.body.aliasId, deleted: '-' }).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return;
        }, function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
            return;
        });
    } else if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.getPatientProfileById = function (req, res) {
    if (req.params.hasOwnProperty('patientId')) {
        this.patient.getPatient({ 'aliasId': req.params.patientId, deleted: '-' }, { patientId: 'id', study: 'study', consent: 'consent' })
            .then(function (Patientresult) {
                let patientId;
                if (Patientresult.length === 1) {
                    patientId = Patientresult[0].patientId;
                } else {
                    res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND));
                    return;
                }
                const promiseArr = [];
                let availableFunctions = ['getDemographicData', 'getImmunisations', 'getMedicalHistory', 'getVisits', 'getTests', 'getTreatments', 'getClinicalEvents', 'getPregnancy', 'getDiagnosis'];

                if (req.body.getOnly && typeof (req.body.getOnly) === 'string')
                    availableFunctions = req.body.getOnly.split(',').filter((func) => availableFunctions.includes(func));

                for (let i = 0; i < availableFunctions.length; i++) {
                    promiseArr.push(SelectorUtils[availableFunctions[i]](patientId));
                }
                let selectorPromises = Promise.all(promiseArr);
                selectorPromises.then(function (result) {
                    const responseObj = {};
                    responseObj.patientId = req.params.patientId;
                    responseObj.id = patientId;
                    responseObj.consent = Boolean(Patientresult[0].consent);
                    for (let i = 0; i < result.length; i++) {
                        responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
                    }
                    res.status(200).json(responseObj);
                    return;
                }, function (error) {
                    res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
                    return;
                });
            }, function (error) {
                res.status(404).json(ErrorHelper(message.errorMessages.NOTFOUND, error));
                return;
            });
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

PatientController.prototype.erasePatient = function (req, res) {
    let patientId = undefined;
    if (req.user.priv !== 1) {
        res.status(401).json(ErrorHelper(message.userError.NORIGHTS));
        return;
    }
    if (!req.body.hasOwnProperty('patientId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.patientId !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    patientId = req.body.patientId;
    getEntry('PATIENTS', { id: patientId }).then(function (result) {
        if (result.length !== 1) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL));
            return;
        }
        eraseEntry('PATIENTS', { id: patientId }).then(function (__unused__result) {
            res.status(200).json({ success: true, messageg: 'Erasure completed. Check for any data retreivable if needed.' });
            return;
        }, function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return;
        });
    }, function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.GETFAIL, error));
        return;
    });
};

module.exports = PatientController;