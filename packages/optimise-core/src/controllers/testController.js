const TestCore = require('../core/test');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const formatToJSON = require('../utils/format-response');
const moment = require('moment');

function TestController() {
    this.test = new TestCore();

    this.createTest = TestController.prototype.createTest.bind(this);
    this.updateTest = TestController.prototype.updateTest.bind(this);
    this.deleteTest = TestController.prototype.deleteTest.bind(this);
}

TestController.prototype.createTest = function (req, res) {
    if (!req.body.hasOwnProperty('visitId') || !req.body.hasOwnProperty('expectedOccurDate') || !req.body.hasOwnProperty('type')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    if (typeof req.body.visitId !== 'number' || typeof req.body.expectedOccurDate !== 'string' || typeof req.body.type !== 'number') {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
    let momentExpect = moment(req.body.expectedOccurDate, moment.ISO_8601);
    if (!momentExpect.isValid() && req.body.expectedOccurDate !== null) {
        let msg = message.dateError[momentExpect.invalidAt()] !== undefined ? message.dateError[momentExpect.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    let momentOccur = moment(req.body.actualOccurredDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('actualOccurredDate') && req.body.actualOccurredDate !== null && !momentOccur.isValid()) {
        let msg = message.dateError[momentOccur.invalidAt()] !== undefined ? message.dateError[momentOccur.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    }
    let entryObj = {
        'orderedDuringVisit': req.body.visitId,
        'type': req.body.type,
        'createdByUser': req.user.id
    };
    if (req.body.hasOwnProperty('expectedOccurDate') && req.body.expectedOccurDate !== null)
        entryObj.expectedOccurDate = momentExpect.valueOf();
    if (req.body.hasOwnProperty('actualOccurredDate') && req.body.actualOccurredDate !== null)
        entryObj.actualOccurredDate = momentOccur.valueOf();
    this.test.createTest(entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.CREATIONFAIL, error));
        return false;
    });
};

TestController.prototype.updateTest = function (req, res) {
    if (!req.body.hasOwnProperty('id')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    }
    let entryObj = Object.assign({}, req.body);
    let momentExpect = moment(req.body.expectedOccurDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('expectedOccurDate') && req.body.expectedOccurDate !== null && !momentExpect.isValid()) {
        let msg = message.dateError[momentExpect.invalidAt()] !== undefined ? message.dateError[momentExpect.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    } else if (req.body.hasOwnProperty('expectedOccurDate') && req.body.expectedOccurDate !== null) {
        entryObj.expectedOccurDate = momentExpect.valueOf();
    }
    let momentOccur = moment(req.body.actualOccurredDate, moment.ISO_8601);
    if (req.body.hasOwnProperty('actualOccurredDate') && req.body.actualOccurredDate !== null && !momentOccur.isValid()) {
        let msg = message.dateError[momentOccur.invalidAt()] !== undefined ? message.dateError[momentOccur.invalidAt()] : message.userError.INVALIDDATE;
        res.status(400).json(ErrorHelper(msg, new Error(message.userError.INVALIDDATE)));
        return;
    } else if (req.body.hasOwnProperty('actualOccurredDate') && req.body.actualOccurredDate !== null) {
        entryObj.actualOccurredDate = momentOccur.valueOf();
    }
    this.test.updateTest(req.user, entryObj).then((result) => {
        res.status(200).json(formatToJSON(result));
        return true;
    }).catch((error) => {
        res.status(400).json(ErrorHelper(message.errorMessages.UPDATEFAIL, error));
        return false;
    });
};

TestController.prototype.deleteTest = function (req, res) {
    if (req.body.hasOwnProperty('testId') && typeof req.body.testId === 'number') {
        this.test.deleteTest(req.user, { 'id': req.body.testId }).then((result) => {
            res.status(200).json(formatToJSON(result));
            return true;
        }).catch((error) => {
            res.status(400).json(ErrorHelper(message.errorMessages.DELETEFAIL, error));
            return false;
        });
    }
    else if (!req.body.hasOwnProperty('testId')) {
        res.status(400).json(ErrorHelper(message.userError.MISSINGARGUMENT));
        return;
    } else {
        res.status(400).json(ErrorHelper(message.userError.WRONGARGUMENTS));
        return;
    }
};

module.exports = TestController;