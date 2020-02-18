import { combineReducers } from 'redux';
import authReducer from './authReducer';
import msgReducer from './msgReducer';
import productReducer from './productReducer';

export default combineReducers({
    msg: msgReducer,
    auth: authReducer,
    product: productReducer
});