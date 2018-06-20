import { combineReducers } from 'redux';
import { groups, loadingError, loadingData } from './groups';
import knockouts from './knockouts';
import champions from './champions';

export default combineReducers({
  groups,
  knockouts,
  loadingError,
  loadingData,
  champions,
});
