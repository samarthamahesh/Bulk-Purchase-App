import axios from 'axios';
import {
    ADD_PRODUCT_SUCCESS,
    ADD_PRODUCT_FAIL,
    GET_ERRORS,
    GET_SUCCESS,
    GET_PRODUCTS,
    ORDER_SUCCESS,
    ORDER_FAIL,
    GET_ORDERS
} from './actionTypes';
import {
    returnErrors,
    returnSuccess
} from './msgActions';

export const addProduct = (itemDescription) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(itemDescription);

    axios
        .post('http://localhost:5000/api/product/add', body, config)
        .then(res => {
            dispatch(returnSuccess(res.data, res.status, GET_SUCCESS));
            dispatch({
                type: ADD_PRODUCT_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_ERRORS));
            dispatch({
                type: ADD_PRODUCT_FAIL
            });
        })
}

export const listProducts = (field, search_string, status) => dispatch => {
    const search_url = `http://localhost:5000/api/product/search/${field}/${search_string}/${status}`;
    axios
        .get(search_url)
        .then(res => {
            dispatch({
                type: GET_PRODUCTS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_ERRORS));
        })
}

export const orderProduct = (order) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(order);

    axios.post("http://localhost:5000/api/order", body, config)
        .then(res => {
            dispatch(returnSuccess(res.data, res.status, ORDER_SUCCESS))
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, ORDER_FAIL));
        })
}

export const statusProduct = (product, status) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({
        product,
        status
    });

    axios.post("http://localhost:5000/api/product/dispatch", body, config)
        .then(res => {
            dispatch(returnSuccess(res.data, res.status))
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_ERRORS));
        });
}



export const listUnorderedProducts = (product_name, user) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({
        user: user,
        product_name: product_name
    })

    axios.post('http://localhost:5000/api/product/unordered', body, config)
        .then(res => {
            dispatch({
                type: GET_ORDERS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.data, err.status, GET_ERRORS));
        });
}

export const listOrderedProducts = (user) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify(user)
    axios.post('http://localhost:5000/api/order/list', body, config)
        .then(res => {
            dispatch({
                type: GET_ORDERS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.data, err.status, GET_ERRORS));
        });
}