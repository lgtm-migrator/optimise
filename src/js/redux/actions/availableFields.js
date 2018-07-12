import actions from './listOfActions.js';
import { apiHelper } from '../fetchHelper.js';

export function APICall(endpoint, cbDispatch) {
    return function () {
        return function (dispatch) {
            return apiHelper(endpoint)
                .then(json => {
                    dispatch(cbDispatch(json));
                })
                .catch(res => res.text().then(msg => console.log(msg)))
        }
    }
};

export const getDrugsCall = APICall('/treatments/drugs', getDrugsSuccess)

export function getDrugsSuccess(payload) {
    return { type: actions.availableFields.GET_DRUGS_SUCCESS, payload: payload }
}

export const getDemoCall = APICall('/demographics/Fields/Demographic', getDemoSuccess)

export function getDemoSuccess(payload) {
    return { type: actions.availableFields.GET_DEMO_FIELDS_SUCCESS, payload: payload }
}

export const getRelationCall = APICall('/demographics/Fields/MedicalCondition', getRelationSuccess)

export function getRelationSuccess(payload) {
    return { type: actions.availableFields.GET_RELATIONS_SUCCESS, payload: payload }
}

export const getVisitFieldsCall = APICall('/data/visitFields', getVisitFieldsSuccess);

export function getVisitFieldsSuccess(payload) {
    return { type: actions.availableFields.GET_VISIT_FIELDS_SUCCESS, payload: payload }
};

export const getTestFieldsCall = APICall('/data/testFields', getTestFieldsSuccess);

export function getTestFieldsSuccess(payload) {
    return { type: actions.availableFields.GET_TEST_FIELDS_SUCCESS, payload: payload }
};

export const getClinicalEventTypesCall = APICall('/data/clinicalEvents', getClinicalEventTypesSuccess);

export function getClinicalEventTypesSuccess(payload) {
    return { type: actions.availableFields.GET_CE_TYPES_SUCCESS, payload: payload }
};

export const getTestTypesCall = APICall('/data/testTypes', getTestTypesSuccess);

export function getTestTypesSuccess(payload) {
    return { type: actions.availableFields.GET_TEST_TYPES_SUCCESS, payload: payload }
};