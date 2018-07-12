import { getPatientProfileById } from './searchPatientById.js';

export const createTestAPICall = (body) => dispatch => {
    console.log(body);
    return fetch('/tests', {
        mode: 'cors',
        headers: {
            'token': '69a87eeedcd5c90fea179a0c2464dff2f130a27a', //change later
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(body.data)
    })
        .then(res => {
            if (res.status === 200) {
                return 0;
            } else {
                return '';
            }
        }, err => console.log(err))
        .then(json => {
            dispatch(getPatientProfileById(body.patientId));         //think about abortion later    //and think about not having to refresh the whole page
        })
}