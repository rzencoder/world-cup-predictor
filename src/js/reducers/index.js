import { combineReducers } from 'redux';
import { items, loadingError, loadingData } from './groups';
import { knockouts } from './knockouts';

export default combineReducers({
    items,
    knockouts,
    loadingError,
    loadingData,
});