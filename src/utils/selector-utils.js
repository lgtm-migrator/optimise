const knex = require('../utils/db-connection');

class SelectorUtils {
    getVisitsWithoutData(patientId) {
        return knex('VISITS')
            .select({visitId: 'id', visitDate: 'visitDate'})
            .where({'patient': patientId, deleted: null})
            .then(result => {
                const returnObj = {visitsWithoutData: result};
                return returnObj;
            });
    }

    getDemographicData(patientId) {
        return knex('PATIENT_DEMOGRAPHIC')
            .select('DOB', 'gender', 'dominantHand', 'ethnicity', 'countryOfOrigin', 'alcoholUsage', 'smokingHistory')
            .where({'patient': patientId, deleted: null})
            .then(result => {
                const returnObj = {demographicData: result[0]};
                return returnObj;
            });
    }

    getTestsWithoutData(patientId) {
        const subquery = knex('VISITS').select({'id': 'orderedDuringVisit'}).where({'patient': patientId, deleted: null});
        return knex('ORDERED_TESTS')
            .select('orderedDuringVisit', 'type', 'expectedOccurDate')
            .where('orderedDuringVisit', 'in', subquery)
            .andWhere({deleted: null})
            .then(result => {
                const returnObj = {testsWithoutData: result};
                return returnObj;
            });
    }

    getImmunisations(patientId) {
        return knex('PATIENT_IMMUNISATION')
            .select('vaccineName', 'immunisationDate')
            .where({patient: patientId, deleted: null})
            .then(result => {
                const returnObj = {immunisations: result};
                return returnObj;
            });
    }

    getMedicalHistory(patientId) {
        return knex('MEDICAL_HISTORY')
            .select('relation', 'conditionName', 'startDate', 'outcome', 'resolvedYear')
            .where({patient: patientId, deleted: null})
            .then(result => {
                const returnObj = {medicalHistory: result};
                return returnObj;
            });
    }

    getVisits(patientId){
        const _this = this;
        return knex('VISITS')
            .select({visitId: 'id', visitDate: 'visitDate'})
            .where({'patient': patientId, deleted: null})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getVisitData(result[i].visitId));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++){
                                result[i].data = data[i];
                            }
                            const returnObj = {visits: result};
                            return returnObj;
                        }
                    );
                    return allPromisesResolving;
                } else {
                    const returnObj = {visits: result};
                    return returnObj;
                }
            });
    }

    getTests(patientId){
        const _this = this;
        const subquery = knex('VISITS').select({'id': 'orderedDuringVisit'}).where({'patient': patientId, deleted: null});
        return knex('ORDERED_TESTS')
            .select({'testId': 'id'},'orderedDuringVisit', 'type', 'expectedOccurDate')
            .where('orderedDuringVisit', 'in', subquery)
            .andWhere({deleted: null})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getTestData(result[i].testId));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++){
                                result[i].data = data[i];
                            }
                            const returnObj = {tests: result};
                            return returnObj;
                        }
                    );
                    return allPromisesResolving;
                } else {
                    const returnObj = {tests: result};
                    return returnObj;
                }
            });
    }

    getTreatments(patientId) {
        const _this = this;
        const subquery = knex('VISITS').select({'id': 'orderedDuringVisit'}).where({'patient': patientId, deleted: null});
        return knex('treatments')
            .select('id', 'orderedDuringVisit', 'drug', 'dose', 'unit', 'form', 'timesPerDay', 'durationWeeks', 'terminatedDate', 'terminatedReason')
            .where('orderedDuringVisit', 'in', subquery)
            .andWhere({deleted: null})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getTreatmentInterruptions(result[i].id));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        interruptions => {
                            for (let i = 0; i < interruptions.length; i++){
                                result[i].interruptions = interruptions[i];
                            }
                            const returnObj = {treatments: result};
                            return returnObj;
                        }
                    );
                    return allPromisesResolving;
                } else {
                    const returnObj = {treatments: result};
                    return returnObj;
                }
            });
    }

    _getVisitData(visitId){
        return knex('visit_collected_data')
            .select('field', 'value')
            .where({'visit': visitId, 'deleted': null});
    }

    _getTestData(testId){
        return knex('test_data')
            .select('field', 'value')
            .where({'test': testId, 'deleted': null});
    }

    _getTreatmentInterruptions(treatmentId) {
        return knex('treatments_interruptions')
            .select('reason', 'startDate', 'endDate')
            .where({'treatment': treatmentId, deleted: null});
    }

    _getCeData(ceId){
        return knex('CLINICAL_EVENTS_DATA')
            .select('field', 'value')
            .where({'clinicalEvent': ceId, 'deleted': null});
    }

    getClinicalEventsWithoutData(patientId) {
        const subquery = knex('VISITS').select('id').where({'patient': patientId, deleted: null});
        return knex('CLINICAL_EVENTS')
            .select('recordedDuringVisit', 'type', 'dateStartDate', 'endDate')
            .where(builder => builder.where('patient', patientId).orWhere('recordedDuringVisit', 'in', subquery))
            .andWhere({deleted: null})
            .then(result => {
                const returnObj = {clinicalEventsWithoutData: result};
                return returnObj;
            });
    }

    getClinicalEvents(patientId) {
        const _this = this;
        const subquery = knex('VISITS').select('id').where({'patient': patientId, deleted: null});
        return knex('clinical_events')
            .select('id', 'recordedDuringVisit', 'type', 'dateStartDate', 'endDate')
            .where(builder => builder.where('patient', patientId).orWhere('recordedDuringVisit', 'in', subquery))
            .andWhere({deleted: null})
            .then(result => {
                if (result.length >= 1) {
                    const promiseArr = [];
                    for (let i = 0; i < result.length; i++){
                        promiseArr.push(_this._getCeData(result[i].id));
                    }
                    const allPromisesResolving = Promise.all(promiseArr).then(
                        data => {
                            for (let i = 0; i < data.length; i++){
                                result[i].data = data[i];
                            }
                            const returnObj = {clinicalEvents: result};
                            return returnObj;
                        }
                    );
                    return allPromisesResolving;
                } else {
                    const returnObj = {clinicalEvents: result};
                    return returnObj;
                }
            });
    }
}

const _singleton = new SelectorUtils();
module.exports = _singleton;
