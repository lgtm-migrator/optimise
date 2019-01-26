const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');

const ClinicalEventModel = {
    patient: null,
    recordedDuringVisit: null,
    type: 0,
    dateStartDate: '',
    endDate: null
};

function ClinicalEvent() {
    this.getClinicalEvent = ClinicalEvent.prototype.getClinicalEvent.bind(this);
    this.createClinicalEvent = ClinicalEvent.prototype.createClinicalEvent.bind(this);
    this.updateClinicalEvent = ClinicalEvent.prototype.updateClinicalEvent.bind(this);
    this.deleteClinicalEvent = ClinicalEvent.prototype.deleteClinicalEvent.bind(this);
}

/**
 * @function getClinicalEvent retrieve the clinical event wished.
 *
 * @returns a Promise that contains the result from the select query
 */
ClinicalEvent.prototype.getClinicalEvent = function (requestedObj) {
    return new Promise((resolve, reject) => getEntry('CLINICAL_EVENTS', requestedObj, '*').then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error))));
};


/**
 * @function createClinicalEvent add a new entry of clinicalEvent
 *
 * @param {user} user Information about the user
 * @param {ClinicalEventModel} ce The added clinicalEvent
 *
 * @returns a new Promise
 */
ClinicalEvent.prototype.createClinicalEvent = function (ce) {
    return new Promise((resolve, reject) => {
        let entryObj = Object.assign({}, ClinicalEventModel, ce);
        return createEntry('CLINICAL_EVENTS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error)));
    });
};

/**
 * @function updateClinicalEvent delete an entry of clinicalEvent from an ID.
 *
 * @param {*} user Information about the user
 * @param {*} idObj ID of the entry that is going to be deleted
 */
ClinicalEvent.prototype.updateClinicalEvent = function (user, clinicalEvent) {
    return new Promise((resolve, reject) => updateEntry('CLINICAL_EVENTS', user, '*', { id: clinicalEvent.id }, clinicalEvent).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

/**
 * @function deleteClinicalEvent delete an entry of clinicalEvent from an ID.
 *
 * @param {*} user Information about the user
 * @param {*} idObj ID of the entry that is going to be deleted
 */
ClinicalEvent.prototype.deleteClinicalEvent = function (user, idObj) {
    return new Promise((resolve, reject) => deleteEntry('CLINICAL_EVENTS', user, idObj).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

module.exports = ClinicalEvent;