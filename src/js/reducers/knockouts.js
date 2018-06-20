import update from 'immutability-helper';
import { KNOCKOUT_DATA_FETCHED, UPDATE_QUALIFIER, UPDATE_KNOCKOUT, REMOVE_TEAM } from '../constants/action-types';

function knockouts(state = [], action) {
  switch (action.type) {
    case KNOCKOUT_DATA_FETCHED:
      return action.data;

    case UPDATE_QUALIFIER:
      return update(state, {
        [action.round]: {
          matches: {
            [action.index1]: {
              team1: {
                name: { $set: action.teams[0].name },
                code: { $set: action.teams[0].code },
              },
            },
            [action.index2]: {
              team2: {
                name: { $set: action.teams[1].name },
                code: { $set: action.teams[1].code },
              },
            },
          },
        },
      });

    case UPDATE_KNOCKOUT:

      return update(state, {
        [action.round]: {
          matches: {
            [action.index1]: {
              [action.home]: {
                name: { $set: action.teams[0].name },
                code: { $set: action.teams[0].code },
              },
            },
          },
        },
      });

    case REMOVE_TEAM:

      return update(state, {
        [action.round]: {
          matches: {
            [action.match]: {
              [action.home]: {
                name: { $set: null },
                code: { $set: null },
              },
            },
          },
        },
      });

    default:
      return state;
  }
}

export default knockouts;
