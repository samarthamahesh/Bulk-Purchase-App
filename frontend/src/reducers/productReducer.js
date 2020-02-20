import { ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAIL, GET_PRODUCTS, GET_ORDERS, AUTH_ERROR, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_FAIL } from "../actions/actionTypes";

const initialstate = {
    result: null
}

export default function(state = initialstate, action) {
    switch(action.type) {
        case ADD_PRODUCT_SUCCESS:
            return {
                ...state,
                ...action.payload
            };
        case ADD_PRODUCT_FAIL:
            return {
                ...state,
                product: null
            };
        case GET_PRODUCTS:
            return {
                ...state,
                result: action.payload
            };
        case GET_ORDERS:
            return {
                ...state,
                result: action.payload
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
        case REGISTER_FAIL:
            return {
                ...state,
                result: null
            }
        default:
            return state
    }
}