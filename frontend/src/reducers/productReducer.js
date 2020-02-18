import { ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAIL, GET_PRODUCTS } from "../actions/actionTypes";

const initialstate = {
    product: null
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
                ...action.payload
            };
        default:
            return state
    }
}