import { GET_ERRORS, CLEAR_ERRORS, GET_SUCCESS, ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAIL, ORDER_SUCCESS, ORDER_FAIL } from '../actions/actionTypes';

const initialState = {
    msg: null,
    status: null,
    id: null,
    isError: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ORDER_FAIL:
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id,
                isError: true
            };
        case CLEAR_ERRORS:
            return {
                msg: {},
                status: null,
                id: null,
                isError: null
            };
        case ORDER_SUCCESS:
        case GET_SUCCESS:
            return {
                msg: action.payload.msg,
                status: action.payload.status,
                id: action.payload.id,
                isError: false
            }
        default:
            return state;
    }
}