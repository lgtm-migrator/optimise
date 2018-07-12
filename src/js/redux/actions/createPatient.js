import actionTypes from './listOfActions.js';
import { getPatientProfileById, getPatientProfileByIdRequest } from './searchPatientById.js';
import { apiHelper } from '../fetchHelper.js';

export const createPatientRequest = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_REQUEST, payload: patientId });
export const createPatientSuccess = patientId => ({ type: actionTypes.createPatients.CREATE_PATIENT_SUCCESS, payload: patientId });
export const createPatientCall = (body) => dispatch => (
    apiHelper('/patients', { method: 'POST', body: JSON.stringify(body.patientData) })
        .then(json => {
            dispatch(getPatientProfileByIdRequest());
            const patientId = json[0];
            const demoData = { ...body.demoData, patient: patientId };
            return apiHelper('/demographics/Demographic', { method: 'POST', body: JSON.stringify(demoData) });
        })
        .then(() => { dispatch(getPatientProfileById(body.patientId)); })

);