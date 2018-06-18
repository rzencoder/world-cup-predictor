import { combineReducers } from 'redux';
import { groups, loadingError, loadingData } from './groups';
import { knockouts } from './knockouts';

export default combineReducers({
    groups,
    knockouts,
    loadingError,
    loadingData,
});