const SelectorUtils = require('../utils/selector-utils');
const uuid = require('uuid/v4');
const { getEntry, createEntry, updateEntry, deleteEntry, searchEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const message = require('../utils/message-utils');
const { DemographicCore } = require('../core/demographic');

const patientModel = {
    aliasId: '',
    study: ''
};

/**
 * @description Patient Core allow to get, search, create and delete a patient
 */
function Patient() {
    this.demo = new DemographicCore();
    this.getPatientProfile = Patient.prototype.getPatientProfile.bind(this);
    this.getPatient = Patient.prototype.getPatient.bind(this);
    this.searchPatients = Patient.prototype.searchPatients.bind(this);
    this.createPatient = Patient.prototype.createPatient.bind(this);
    this.deletePatient = Patient.prototype.deletePatient.bind(this);
}

Patient.prototype.getPatient = function (whereObj, selectedObj) {
    return new Promise((resolve, reject) => {
        whereObj.deleted = '-';
        return getEntry('PATIENTS', whereObj, selectedObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.GETFAIL, error)));
    });
};

/**
 * @function getPatientProfile
 * @description Return patient information (demographic / visit / etc... )
 * @param {Object} whereObj where closure for query
 * @param {Boolean} deleted True to look for not deleted entries. False for also deleted ones.
 * @param {string} getOnly Filtering return.
 */
Patient.prototype.getPatientProfile = function (whereObj, deleted, getOnly) {
    return new Promise((resolve, reject) => Patient.prototype.getPatient(whereObj, { patientId: 'id', alias: 'aliasId', study: 'study', consent: 'consent' })
        .then((Patientresult) => {
            let patientId;
            if (Patientresult.length === 1) {
                patientId = Patientresult[0].patientId;
            } else {
                return reject(ErrorHelper(message.errorMessages.NOTFOUND));
            }
            let promiseArr = [];
            let availableFunctions = ['getDemographicData', 'getImmunisations', 'getMedicalHistory', 'getVisits', 'getTests', 'getTreatments', 'getClinicalEvents', 'getPregnancy', 'getDiagnosis'];

            if (getOnly && typeof getOnly === 'string')
                availableFunctions = getOnly.split(',').filter((func) => availableFunctions.includes(func));

            for (let i = 0; i < availableFunctions.length; i++) {
                promiseArr.push(SelectorUtils[availableFunctions[i]](patientId, deleted));
            }
            let selectorPromises = Promise.all(promiseArr);
            selectorPromises.then((result) => {
                const responseObj = {};
                responseObj.patientId = Patientresult[0].alias;
                responseObj.id = patientId;
                responseObj.consent = Boolean(Patientresult[0].consent);
                for (let i = 0; i < result.length; i++) {
                    responseObj[Object.keys(result[i])[0]] = result[i][Object.keys(result[i])[0]];
                }
                return resolve(responseObj);
            }).catch((error) => reject(ErrorHelper(message.errorMessages.NOTFOUND, error)));
            return true;
        }).catch((error) => reject(ErrorHelper(message.errorMessages.NOTFOUND, error))));
};

/**
 * @description Search a patient from a 'like' query.
 * @returns Promise that contains the patient in the success callback and the error stack in the error callback
 * @param {string} query The aliasId of the patient seeking for
 */
Patient.prototype.searchPatients = function (queryfield, queryvalue) {
    return new Promise((resolve, reject) => searchEntry(queryfield, queryvalue).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.SEARCHFAIL, error))));
};

/**
 * @description Create a new patient
 * @param {*} patient The new created patient
 */
Patient.prototype.createPatient = function (patient) {
    return new Promise((resolve, reject) => {
        let entryObj = Object.assign({}, patientModel, patient);
        entryObj.uuid = uuid();
        return createEntry('PATIENTS', entryObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error)));
    });
};

/**
 * @description Update a new patient
 * @param {*} user Information about the user
 * @param {*} patient The new created patient
 */
Patient.prototype.updatePatient = function (user, patientObj) {
    return new Promise((resolve, reject) => updateEntry('PATIENTS', user, '*', { id: patientObj.id }, patientObj).then((result) => resolve(result)).catch((error) => reject(ErrorHelper(message.errorMessages.CREATIONFAIL, error))));
};

/**
 * @function deletePatient delete an entry of Patient from an ID.
 *
 * @param {*} user Information about the user
 * @param {*} idObj ID of the entry that is going to be deleted
 */
Patient.prototype.deletePatient = function (user, idObj) {
    return new Promise((resolve, reject) => deleteEntry('PATIENTS', user, idObj).then((success) => resolve(success)).catch((error) => reject(ErrorHelper(message.errorMessages.DELETEFAIL, error))));
};

module.exports = Patient;