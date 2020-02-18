import {
    GET_ERRORS,
    CLEAR_ERRORS,
    GET_SUCCESS
} from './actionTypes';

export const returnErrors = (msg, status, id) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    };
};

export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    };
};

export const returnSuccess = (msg, status, id) => {
    return {
        type: GET_SUCCESS,
        payload: { msg, status, id }
    };
};