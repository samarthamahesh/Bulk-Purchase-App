import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    AUTH_ERROR,
    LOADED_USER,
    LOADING_USER,
    GET_ERRORS,
    GET_SUCCESS
} from './actionTypes';
import { returnErrors, returnSuccess } from './msgActions';
import axios from 'axios';
import store from '../store';

export const request_headers = getState => {
    const token = getState().auth.token;
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if(token) {
        config.headers['auth-token'] = token;
    }
    return config;
}

export const loadUser = () => (dispatch, getState) => {
    dispatch({type: LOADING_USER});
    axios
        .get('http://localhost:5000/api/auth/user', request_headers(getState))
        .then(res => {
            dispatch({
                type: LOADED_USER,
                payload: res.data
            });
        })
        .catch(err => {
            if(err.response) {
                dispatch(returnErrors(err.response.data, err.response.status));
            }
            dispatch({
                type: AUTH_ERROR
            });
        });
}

export const register = (credentials) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify(credentials);

    axios
        .post('http://localhost:5000/api/auth/register', body, config)
        .then(res => {
            dispatch(returnSuccess(res.data, res.status, GET_SUCCESS));
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_ERRORS))
            dispatch({
                type: REGISTER_FAIL
            });
        });
};

export const login = (credentials) => (dispatch) => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const body = JSON.stringify(credentials);

    axios
        .post('http://localhost:5000/api/auth/login', body, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });
            store.dispatch(loadUser());
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, GET_ERRORS))
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    };
};