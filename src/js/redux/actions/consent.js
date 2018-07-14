import { getPatientProfileById } from './searchPatientById';
import { apiHelper } from '../fetchHelper';

export const updateConsentAPICall = (body) => dispatch => {
    return apiHelper('/patients', { method: 'PUT', body: JSON.stringify(body.data) })
        .then(() => {
            dispatch(getPatientProfileById(body.patientId));
        })
        .catch(msg => console.log(msg));
};