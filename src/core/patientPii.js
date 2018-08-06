const { getEntry, createEntry, updateEntry, deleteEntry } = require('../utils/controller-utils');
const ErrorHelper = require('../utils/error_helper');
const messages = require('../utils/message-utils');

function PatientPii() {
    this.getPatientPii = PatientPii.prototype.getPatientPii.bind(this);
    this.createPatientPii = PatientPii.prototype.createPatientPii.bind(this);
    this.updatePatientPii = PatientPii.prototype.updatePatientPii.bind(this);
    this.deletePatientPii = PatientPii.prototype.deletePatientPii.bind(this);
}

PatientPii.prototype.getPatientPii = function (whereObj) {
    return new Promise(function (resolve, reject) {
        return getEntry('PATIENT_PII', whereObj, { id: 'id', patient: 'patient', firstName: 'firstName', surname: 'surname', fullAddress: 'fullAddress', postcode: 'postcode' }).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPii.prototype.createPatientPii = function (entryObj) {
    return new Promise(function (resolve, reject) {
        return createEntry('PATIENT_PII', entryObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPii.prototype.updatePatientPii = function (user, idPatient, updatedObj) {
    return new Promise(function (resolve, reject) {
        return updateEntry('PATIENT_PII', user, '*', { 'patient': idPatient }, updatedObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

PatientPii.prototype.deletePatientPii = function (user, whereObj) {
    return new Promise(function (resolve, reject) {
        return deleteEntry('PATIENT_PII', user, whereObj).then(function (result) {
            return resolve(result);
        }).catch(function (error) {
            return reject(ErrorHelper(messages.errorMessages.GETFAIL, error));
        });
    });
};

module.exports = PatientPii;