import list from '../state';


export function itemsHasErrored(bool) {
    return {
        type: 'ITEMS_HAS_ERRORED',
        hasErrored: bool
    };
}

export function itemsIsLoading(bool) {
    return {
        type: 'ITEMS_IS_LOADING',
        isLoading: bool
    };
}

export function updateQualifier(teams, index1, index2, round) {
    return {
        type: 'UPDATE_QUALIFIER',
        teams: teams,
        index1: index1,
        index2: index2,
        round: round
    };
}

export function updateQual(teams, index1, index2, round) {
    return (dispatch) => {
        dispatch(updateQualifier(teams, index1, index2, round))
    }
}

export function updateKnock(teams, index1, round, home) {
    return {
        type: 'UPDATE_KNOCKOUT',
        teams: teams,
        index1: index1,
        round: round,
        home: home
    };
}

export function updateKnockout(teams, index1, round, home) {
    return (dispatch) => {
        dispatch(updateKnock(teams, index1, round, home))
    }
}

export function updateGoal(group, index, score, home) {
    return {
        type: 'UPDATE_SCORE',
        group: group,
        index: index,
        score: score,
        home: home
    };
}

export function updateScore(group, index, score, home) {
    return (dispatch) => {
        dispatch(updateGoal(group, index, score, home))
    }
}

export function itemsFetchDataSuccess(data) {
    return {
        type: 'ITEMS_FETCH_DATA_SUCCESS',
        data
    };
}

export function fetchKnockouts(data) {
    return {
        type: 'FETCH_KNOCKOUTS',
        data
    };
}

function processData (data) {
    const groupGames = data.rounds.slice(0, 15);
    let knockoutGames = data.rounds.slice(15, 18)
    knockoutGames.push(data.rounds[19]);
    const groupNames = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'];
    
    const groups = groupNames.map((name, i) => {
        let sortedGames = [];
        groupGames.filter((game, i) => {                 
          return game.matches.forEach(match => {
            if(match.group === name) {
                match.confirmed = true;
                if (match.score1 === null) match.confirmed = false;
                sortedGames.push(match);
            }
          });
        });
        return { name: name, matches: sortedGames }    
    });
    
       if(!knockoutGames[0]['matches'].length) {
            knockoutGames = list
       }
       function swapElement(array, indexA, indexB) {
           var tmp = array[indexA];
           array[indexA] = array[indexB];
           array[indexB] = tmp;
       }
       swapElement(knockoutGames[0]['matches'], 2, 4);
       swapElement(knockoutGames[0]['matches'], 3, 5);
       

    return { groupGames: groups, knockoutGames: knockoutGames }
}

export function itemsFetchData(url) {
    
    return (dispatch) => {
        dispatch(itemsIsLoading(true));
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
               
                return response;
            })
            .then((response) => response.json())
            .then((data) => {
                const processedData = processData(data);
                 dispatch(itemsFetchDataSuccess(processedData.groupGames));
                 dispatch(fetchKnockouts(processedData.knockoutGames));
            })
            .then(() => dispatch(itemsIsLoading(false)))
            .catch(() => dispatch(itemsHasErrored(true)));
    };
}
