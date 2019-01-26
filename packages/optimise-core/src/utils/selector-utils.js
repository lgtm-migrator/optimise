const knex = require('../utils/db-connection');
const { PregnancyCore } = require('../core/demographic');
const DiagnosisCore = require('../core/patientDiagnosis');

class SelectorUtils {
    getVisitsWithoutData(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('VISITS')
            .select({ visitId: 'id', visitDate: 'visitDate', type: 'type', communication: 'communication' })
            .where(whereObj)
            .then(result => {
                const returnObj = { visitsWithoutData: result };
                return returnObj;
            });
    }

    getDemographicData(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('PATIENT_DEMOGRAPHIC')
            .select('id', 'DOB', 'gender', 'dominantHand', 'ethnicity', 'countryOfOrigin', 'alcoholUsage', 'smokingHistory')
            .where(whereObj)
            .then(result => {
                const returnObj = { demographicData: result[0] };
                return returnObj;
            });
    }

    getTestsWithoutData(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('VISITS').select({ 'id': 'id' }).where(whereObj).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            let innerWhereObj = {};
            if (deleted === true)
                innerWhereObj.deleted = '-';
            return knex('ORDERED_TESTS')
                .select('orderedDuringVisit', 'type', 'expectedOccurDate', 'actualOccurredDate')
                .whereIn('orderedDuringVisit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    const returnObj = { testsWithoutData: result };
                    return returnObj;
                });
        });
    }

    getImmunisations(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('PATIENT_IMMUNISATION')
            .select('id', 'vaccineName', 'immunisationDate')
            .where({ 'patient': patientId, 'deleted': '-' })
            .then(result => {
                const returnObj = { immunisations: result };
                return returnObj;
            });
    }

    getMedicalHistory(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('MEDICAL_HISTORY')
            .select('id', 'relation', 'conditionName', 'startDate', 'outcome', 'resolvedYear')
            .where(whereObj)
            .then(result => {
                const returnObj = { medicalHistory: result };
                return returnObj;
            });
    }

    getVisits(patientId, deleted) {
        const _this = this;
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('VISITS')
            .select({ id: 'id', visitDate: 'visitDate', type: 'type', communication: 'communication' })
            .where(whereObj)
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++) {
                        promiseArr.push(_this._getVisitData(result[i].id, deleted));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++) {
                                result[i].data = data[i];
                            }
                            const returnObj = { visits: result };
                            return returnObj;
                        }
                    );
                    return allPromisesResolving;
                } else {
                    const returnObj = { visits: result };
                    return returnObj;
                }
            });
    }

    getTests(patientId, deleted) {
        const _this = this;
        let whereObj = { 'patient': patientId };
        let innerWhereObj = {};
        if (deleted === true) {
            whereObj.deleted = '-';
            innerWhereObj.deleted = '-';
        }
        return knex('VISITS').select('id').where(whereObj).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('ORDERED_TESTS')
                .select({ 'id': 'id' }, 'orderedDuringVisit', 'type', 'expectedOccurDate', 'actualOccurredDate')
                .whereIn('orderedDuringVisit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getTestData(result[i].id, deleted));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            data => {
                                for (let i = 0; i < data.length; i++) {
                                    result[i].data = data[i];
                                }
                                const returnObj = { tests: result };
                                return returnObj;
                            }
                        );
                        return allPromisesResolving;
                    } else {
                        const returnObj = { tests: result };
                        return returnObj;
                    }
                });
        });
    }

    getTreatments(patientId, deleted) {
        const _this = this;
        let whereObj = { 'patient': patientId };
        let innerWhereObj = {};
        if (deleted === true) {
            whereObj.deleted = '-';
            innerWhereObj.deleted = '-';
        }
        return knex('VISITS').select({ 'id': 'id', 'visitDate': 'visitDate', 'type': 'type' }).where(whereObj).then(resu => {
            let ids = [];
            let dates = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
                dates[resu[i].id] = resu[i].visitDate;
            }
            return knex('TREATMENTS')
                .select('id', 'orderedDuringVisit', 'drug', 'dose', 'unit', 'form', 'times', 'intervalUnit', 'startDate', 'terminatedDate', 'terminatedReason')
                .whereIn('orderedDuringVisit', ids)
                .andWhere(innerWhereObj)
                .then(result => {
                    for (let i = 0; i < result.length; i++) {
                        result[i].visitDate = dates[result[i].orderedDuringVisit];
                    }
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getTreatmentInterruptions(result[i].id, deleted));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            interruptions => {
                                for (let i = 0; i < interruptions.length; i++) {
                                    result[i].interruptions = interruptions[i];
                                }
                                const returnObj = { treatments: result };
                                return returnObj;
                            }
                        );
                        return allPromisesResolving;
                    } else {
                        const returnObj = { treatments: result };
                        return returnObj;
                    }
                });
        });
    }

    getPregnancy(patientId, deleted) {
        let pregnancy = new PregnancyCore();
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        return pregnancy.getPregnancy(whereObj).then((result) => ({ 'pregnancy': result }), (__unused__error) => ({ 'pregnancy': [] }));
    }

    _getVisitData(visitId, deleted) {
        let whereObj = { 'visit': visitId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('VISIT_DATA')
            .select('id', 'field', 'value')
            .where(whereObj);
    }

    _getTestData(testId, deleted) {
        let whereObj = { 'test': testId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('TEST_DATA')
            .select('id', 'field', 'value')
            .where(whereObj);
    }

    _getTreatmentInterruptions(treatmentId, deleted) {
        let whereObj = { 'treatment': treatmentId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('TREATMENTS_INTERRUPTIONS')
            .select('id', 'reason', 'startDate', 'endDate', 'meddra')
            .where(whereObj);
    }

    _getCeData(ceId, deleted) {
        let whereObj = { 'clinicalEvent': ceId };
        if (deleted === true)
            whereObj.deleted = '-';
        return knex('CLINICAL_EVENTS_DATA')
            .select('id', 'field', 'value')
            .where(whereObj);
    }

    getClinicalEventsWithoutData(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        let innerWhereObj = {};
        if (deleted === true) {
            whereObj.deleted = '-';
            innerWhereObj.deleted = '-';
        }
        return knex('VISITS').select('id').where(whereObj).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('CLINICAL_EVENTS')
                .select('id', 'recordedDuringVisit', 'type', 'dateStartDate', 'endDate', 'meddra')
                .where(builder => builder.where('patient', patientId).orWhere('recordedDuringVisit', 'in', ids))
                .andWhere(innerWhereObj)
                .then(result => {
                    const returnObj = { clinicalEventsWithoutData: result };
                    return returnObj;
                });
        });
    }

    getClinicalEvents(patientId, deleted) {
        const _this = this;
        let whereObj = { 'patient': patientId };
        let innerWhereObj = {};
        if (deleted === true) {
            whereObj.deleted = '-';
            innerWhereObj.deleted = '-';
        }
        return knex('VISITS').select('id').where(whereObj).then(resu => {
            let ids = [];
            for (let i = 0; i < resu.length; i++) {
                ids[i] = resu[i].id;
            }
            return knex('CLINICAL_EVENTS')
                .select('id', 'recordedDuringVisit', 'type', 'dateStartDate', 'endDate', 'meddra')
                .where(builder => builder.where('patient', patientId).orWhere('recordedDuringVisit', 'in', ids))
                .andWhere(innerWhereObj)
                .then(result => {
                    if (result.length >= 1) {
                        const promiseArr = [];
                        for (let i = 0; i < result.length; i++) {
                            promiseArr.push(_this._getCeData(result[i].id, deleted));
                        }
                        const allPromisesResolving = Promise.all(promiseArr).then(
                            data => {
                                for (let i = 0; i < data.length; i++) {
                                    result[i].data = data[i];
                                }
                                const returnObj = { clinicalEvents: result };
                                return returnObj;
                            }
                        );
                        return allPromisesResolving;
                    } else {
                        const returnObj = { clinicalEvents: result };
                        return returnObj;
                    }
                });
        });
    }

    getDiagnosis(patientId, deleted) {
        let whereObj = { 'patient': patientId };
        if (deleted === true)
            whereObj.deleted = '-';
        let diagnosis = new DiagnosisCore();
        return diagnosis.getPatientDiagnosis(whereObj).then((result) => ({ 'diagnosis': result }), (__unused__error) => ({ 'diagnosis': [] }));
    }
}

const _singleton = new SelectorUtils();
module.exports = _singleton;