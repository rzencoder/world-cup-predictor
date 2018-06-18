import update from 'immutability-helper';

export function itemsHasErrored(state = false, action) {
  switch (action.type) {
    case 'ITEMS_HAS_ERRORED':
      return action.hasErrored;

    default:
      return state;
  }
}

export function itemsIsLoading(state = false, action) {
  switch (action.type) {
    case 'ITEMS_IS_LOADING':
      return action.isLoading;

    default:
      return state;
  }
}

export function items(state = [], action) {
  switch (action.type) {
    case 'ITEMS_FETCH_DATA_SUCCESS':
      return action.data;

    

    case 'UPDATE_SCORE':
      return update(state, {
          [action.group]: {
          matches:{
            [action.index]:{
            ['score' + action.home]: {
              $set: action.score
            }
          }
          }
        }
      })
    default:
      return state;
  }
}

export function knockouts (state = [], action) {
  switch (action.type) {
    case 'FETCH_KNOCKOUTS':
      return action.data;

    case 'UPDATE_QUALIFIER':
      return update(state, {
          [action.round]: {
            matches: {
              [action.index1]: {
                team1: {
                  name: { $set: action.teams[0]['name'] }, 
                  code: { $set: action.teams[0]['code'] }
                }           
              },
              [action.index2]: {
                team2: {
                  name: {
                    $set: action.teams[1]['name']
                  },
                  code: {
                    $set: action.teams[1]['code']
                  }
                }
              }
            }
          }
      })

      case 'UPDATE_KNOCKOUT':
      console.log(action.home)
      return update(state, {
        
          [action.round]: {
            matches: {
              [action.index1]: {
                [action.home]: {
                  name: { $set: action.teams[0]['name'] }, 
                  code: { $set: action.teams[0]['code'] }
                }           
              }
            }
          }
      })

    default:
      return state;
  }
}