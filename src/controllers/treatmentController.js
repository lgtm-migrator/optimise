const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const TreatmentCore = require('../core/treatment');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');

function TreatmentController() {
    this.treatment = new TreatmentCore();

    this.createTreatment = TreatmentController.prototype.createTreatment.bind(this);
    this.addTerminationDate = TreatmentController.prototype.addTerminationDate.bind(this);
    this.editTreatment = TreatmentController.prototype.editTreatment.bind(this);
    this.deleteTreatment = TreatmentController.prototype.deleteTreatment.bind(this);
    this.addInterruption = TreatmentController.prototype.addInterruption.bind(this);
    this.deleteInterruption = TreatmentController.prototype.deleteInterruption.bind(this);
    this.getReasons = TreatmentController.prototype.getReasons.bind(this);
    this.getDrugs = TreatmentController.prototype.getDrugs.bind(this);
}

TreatmentController.prototype.createTreatment = function (req, res) {
    if (!(req.body.hasOwnProperty('visitId') && req.body.hasOwnProperty('drugId') && req.body.hasOwnProperty('startDate'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (!(typeof req.body.visitId === 'number' && typeof req.body.drugId === 'number' && typeof req.body.startDate === 'string')) {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    if ((req.body.hasOwnProperty('dose') && typeof req.body.dose !== 'number') ||
        (req.body.hasOwnProperty('unit') && req.body.unit !== 'mg' && req.body.unit !== 'cc') ||
        (req.body.hasOwnProperty('form') && req.body.form !== 'OR' && req.body.form !== 'IV' && req.body.form !== 'IM' && req.body.form !== 'SC') ||
        (req.body.hasOwnProperty('times') && typeof req.body.times !== 'number') ||
        (req.body.hasOwnProperty('intervalUnit') && req.body.intervalUnit !== 'hour' && req.body.intervalUnit !== 'day' &&
            req.body.intervalUnit !== 'week' && req.body.intervalUnit !== 'month' && req.body.intervalUnit !== 'year')) {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    // No specific reason for 500 (max number of times) here
    if (req.body.hasOwnProperty('times') && (req.body.times < 0 || req.body.times > 500)) {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    if (req.body.hasOwnProperty('dose') && req.body.dose < 0) {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    if (req.body.hasOwnProperty('times') && !req.body.hasOwnProperty('intervalUnit') || req.body.hasOwnProperty('intervalUnit') && !req.body.hasOwnProperty('times')) {
        res.status(400).json(ErrorHelper(message.userError.FREQANDINTERVALMUSTCOPRESENT));
        return;
    }
    let momentStart = moment(req.body.startDate, moment.ISO_8601);
    let momentTerminated = moment(req.body.terminatedDate, moment.ISO_8601);
    if (!momentStart.isValid()) {
        res.status(400).json(ErrorHelper(message.dateError[momentStart.invalidAt()], new Error(message.userError.INVALIDDATE)));
        return;
    }
    if (req.body.hasOwnProperty('terminatedDate') && !momentTerminated.isValid()) {
        res.status(400).json(ErrorHelper(message.dateError[momentTerminated.invalidAt()], new Error(message.userError.INVALIDDATE)));
        return;
    }
    let entryObj = {
        'orderedDuringVisit': req.body.visitId,
        'drug': req.body.drugId,
        'dose': (req.body.hasOwnProperty('dose') ? req.body.dose : null),
        'unit': (req.body.hasOwnProperty('unit') ? req.body.unit : null),   // hardcoded SQL: only mg or cc
        'form': (req.body.hasOwnProperty('form') ? req.body.form : null),   // hardcoded SQL: only OR, IV, IM or SC
        'times': (req.body.hasOwnProperty('times') ? req.body.times : null),
        'intervalUnit': (req.body.hasOwnProperty('intervalUnit') ? req.body.intervalUnit : null), // hardcoded: hour, day, week, month, year
        'startDate': momentStart.valueOf(),
        'terminatedDate': (req.body.hasOwnProperty('terminatedDate') ? momentTerminated.valueOf() : null),
        'terminatedReason': (req.body.hasOwnProperty('terminatedReason') ? req.body.terminatedReason : null),
        'createdByUser': req.user.id
    };
    this.treatment.createTreatment(entryObj).then(function (result) {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch(function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return false;
    });
};

TreatmentController.prototype.addTerminationDate = function (req, res) {    //for adding termination date
    if ((req.body.hasOwnProperty('treatmentId') && req.body.hasOwnProperty('terminationDate')) && req.body.hasOwnProperty('terminatedReason') &&
        typeof req.body.treatmentId === 'number' && typeof req.body.terminatedDate === 'string' && typeof req.body.terminatedReason === 'number') {
        let momentTerminated = moment(req.body.terminatedDate, moment.ISO_8601);
        if (!momentTerminated.isValid()) {
            res.status(400).json(ErrorHelper(message.dateError[momentTerminated.invalidAt()], new Error(message.userError.INVALIDDATE)));
            return;
        }
        this.treatment.addTerminationDateTreatment(req.body.treatmentId, { 'terminatedDate': momentTerminated.valueOf(), 'terminatedReason': req.body.terminatedReason })
            .then(function (result) {
                res.status(200).json(formatToJSON(result));
                return true;
            }).catch(function (error) {
                res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
                return false;
            });
    } else if (!((req.body.hasOwnProperty('treatmentId') && req.body.hasOwnProperty('terminationDate')) && req.body.hasOwnProperty('terminatedReason'))) {
        res.status(400).json(message.userError.MISSINGARGUMENT);
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

TreatmentController.prototype.editTreatment = function (req, res) {
    if (req.body.hasOwnProperty('id') && typeof req.body.id === 'number') {

        let momentStart = moment(req.body.startDate, moment.ISO_8601);
        let momentTerminated = moment(req.body.terminatedDate, moment.ISO_8601);
        if (!momentStart.isValid()) {
            res.status(400).json(ErrorHelper(message.dateError[momentStart.invalidAt()], new Error(message.userError.INVALIDDATE)));
            return;
        }
        if (req.body.hasOwnProperty('terminatedDate') && !momentTerminated.isValid()) {
            res.status(400).json(ErrorHelper(message.dateError[momentTerminated.invalidAt()], new Error(message.userError.INVALIDDATE)));
            return;
        }
        let newObj = Object.assign({}, req.body);
        newObj.startDate = momentStart.valueOf();
        newObj.terminatedDate = (req.body.hasOwnProperty('terminatedDate') ? momentTerminated.valueOf() : null);

        this.treatment.updateTreatment(req.user, req.body.id, newObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch(function (error) {
            res.status(400).json(ErrorHelper(message.userError.UPDATEFAIL, error));
            return false;
        });
        return;
    } else if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

TreatmentController.prototype.deleteTreatment = function (req, res) {
    if (!req.body.hasOwnProperty('treatmentId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.treatmentId !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    this.treatment.deleteTreatment(req.user, req.body.treatmentId).then(function (result) {
        if (result.body === 0) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL));
            return false;
        } else {
            res.status(200).json(formatToJSON(result));
            return true;
        }
    }).catch(function (error) {
        res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
        return false;
    });
};

TreatmentController.prototype.addInterruption = function (req, res) {    //need to search if treatment exists
    if (req.body.hasOwnProperty('treatmentId') && req.body.hasOwnProperty('start_date') &&
        typeof req.body.treatmentId === 'number' && typeof req.body.start_date === 'string') {
        let momentStart = moment(req.body.start_date, moment.ISO_8601);
        let momentEnd = moment(req.body.end_date, moment.ISO_8601);
        if (!momentStart.isValid()) {
            let msg = message.dateError[momentStart.invalidAt()] !== undefined ? message.dateError[momentStart.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        if (req.body.hasOwnProperty('end_date') && !momentEnd.isValid()) {
            let msg = message.dateError[momentEnd.invalidAt()] !== undefined ? message.dateError[momentEnd.invalidAt()] : message.userError.INVALIDDATE;
            res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
            return;
        }
        let entryObj = {
            'treatment': req.body.treatmentId,
            'startDate': momentStart.valueOf(),
            'meddra': req.body.hasOwnProperty('meddra') ? req.body.meddra : null,
            'endDate': (req.body.hasOwnProperty('end_date') ? momentEnd.valueOf() : null),
            'reason': req.body.hasOwnProperty('reason') ? req.body.reason : null,
            'createdByUser': req.user.id
        };
        this.treatment.addInterruption(req.user, entryObj).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch(function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
            return false;
        });
    } else if (!(req.body.hasOwnProperty('treatmentId') && req.body.hasOwnProperty('start_date'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

TreatmentController.prototype.deleteInterruption = function (req, res) {
    if (req.body.hasOwnProperty('treatmentInterId') && typeof req.body.treatmentInterId === 'number') {
        this.treatment.deleteInterruption(req.user, req.body.treatmentInterId).then(function (result) {
            if (result.body === 0) {
                res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL));
                return false;
            } else {
                res.status(200).json(formatToJSON(result));
                return true;
            }
        }).catch(function (error) {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    } else if (!(req.body.hasOwnProperty('treatmentInterId'))) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

TreatmentController.prototype.getReasons = function (req, res) {
    if (Object.keys(req.query).length !== 0 && req.query.hasOwnProperty('name')) {
        this.treatment.searchReasons(`%${req.query.name}%`).then(function (result) {
            res.status(200).json(result);
            return true;
        }).catch(function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
        return;
    } else {
        this.treatment.getReasons().then(function (result) {
            res.status(200).json(result);
            return true;
        }).catch(function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
        return;
    }
};

TreatmentController.prototype.getDrugs = function (req, res) {
    if (Object.keys(req.query).length !== 0 && req.query.hasOwnProperty('name')) {
        this.treatment.searchDrugs(`%${req.query.name}%`).then(function (result) {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch(function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
        return;
    } else {
        this.treatment.getDrugs().then(function (result) {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch(function (error) {
            res.status(404).json(ErrorHelper(message.errorMessages.GETFAIL, error));
            return false;
        });
        return;
    }
};

module.exports = TreatmentController;