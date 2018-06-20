import { UPDATE_CHAMPIONS, REMOVE_CHAMPIONS } from '../constants/action-types';

function champions(state = { name: null, code: null }, action) {
  switch (action.type) {
    case UPDATE_CHAMPIONS:
      return action.team;

    case REMOVE_CHAMPIONS:
      return { name: null, code: null };

    default:
      return state;
  }
}

export default champions;
