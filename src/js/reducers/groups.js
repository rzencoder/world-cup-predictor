import update from 'immutability-helper';
import { LOADING_DATA, LOADING_ERROR, UPDATE_SCORE, DATA_FETCHED } from '../constants/action-types';

export function loadingError(state = false, action) {
  switch (action.type) {
    case LOADING_ERROR:
      return action.isError;

    default:
      return state;
  }
}

export function loadingData(state = false, action) {
  switch (action.type) {
    case LOADING_DATA:
      return action.isLoading;

    default:
      return state;
  }
}

export function groups(state = [], action) {
  switch (action.type) {
    case DATA_FETCHED:
      return action.data;

    case UPDATE_SCORE:
      return update(state, {
          [action.group]: {
          matches: {
            [action.index]: {
              ['score' + action.home]: { $set: action.score }
            }
          }
        }
      });

    default:
      return state;
  }
}
