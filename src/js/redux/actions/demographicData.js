import { getPatientProfileById } from './searchPatient';
import { apiHelper } from '../fetchHelper';

export const createImmunisationAPICall = (body) => dispatch => (
    apiHelper('/demographics/Immunisation', { method: 'POST', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg))
);

export const deleteImmunisationAPICall = (body) => dispatch => (
    apiHelper('placeholderAPI', { method: 'POST', body: JSON.stringify(body.data) })
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