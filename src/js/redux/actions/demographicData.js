import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';
import history from '../history';

export const createImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);

export const deleteImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);

export const createPregnancyAPICall = (body) => dispatch => (
    apiHelper('/demographics/Pregnancy', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);

export const deletePregnancyAPICall = (body) => dispatch => (
    apiHelper('/demographics/Pregnancy', { method: 'DELETE', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);

export const updateDemographicAPICall = (body) => dispatch => (
    apiHelper('/demographics/Demographic', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);


export const updateDiagnosisAPICall = (body) => dispatch => (
    apiHelper('/patientDiagnosis', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            history.push(body.to);
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);