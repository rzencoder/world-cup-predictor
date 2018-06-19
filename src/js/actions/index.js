import { tempMatches } from '../data/matchData';
import { KNOCKOUT_DATA_FETCHED, UPDATE_QUALIFIER, UPDATE_KNOCKOUT,
    UPDATE_SCORE, DATA_FETCHED, LOADING_DATA, LOADING_ERROR, REMOVE_TEAM,
    UPDATE_CHAMPIONS, REMOVE_CHAMPIONS} from '../constants/action-types';

export function loadingError(bool) {
    return {
        type: LOADING_ERROR,
        isError: bool
    };
}

export function loadingData(bool) {
    return {
        type: LOADING_DATA,
        isLoading: bool
    };
}

function updateQual(teams, index1, index2, round) {
    return {
        type: UPDATE_QUALIFIER,
        teams: teams,
        index1: index1,
        index2: index2,
        round: round
    };
}

export function updateQualifier(teams, index1, index2, round) {
    return dispatch => {
        dispatch(updateQual(teams, index1, index2, round))
    }
}

function removeMatch(round, match, home) {
    return {
        type: REMOVE_TEAM,
        round: round,
        match: match,
        home: home
    };
}

export function removeTeam(round, match, home) {
    return dispatch => {
        dispatch(removeMatch(round, match, home))
    }
}

function removeChamps(team) {
    return {
        type: REMOVE_CHAMPIONS,
        team: team
    };
}

export function removeChampions(team) {
    return dispatch => {
        dispatch(removeChamps(team))
    }
}

function updateChamps(team) {
    return {
        type: UPDATE_CHAMPIONS,
        team: team
    };
}

export function updateChampions(team) {
    return dispatch => {
        dispatch(updateChamps(team))
    }
}

function updateKnock(teams, index1, round, home) {
    return {
        type: UPDATE_KNOCKOUT,
        teams: teams,
        index1: index1,
        round: round,
        home: home
    };
}

export function updateKnockout(teams, index1, round, home) {
    return dispatch => {
        dispatch(updateKnock(teams, index1, round, home))
    }
}

export function updateGoal(group, index, score, home) {
    return {
        type: UPDATE_SCORE,
        group: group,
        index: index,
        score: score,
        home: home
    };
}

export function updateScore(group, index, score, home) {
    return dispatch => {
        dispatch(updateGoal(group, index, score, home))
    }
}

export function groupsFetched(data) {
    return {
        type: DATA_FETCHED,
        data
    };
}

export function fetchKnockouts(data) {
    return {
        type: KNOCKOUT_DATA_FETCHED,
        data
    };
}

// Organise data collected from api and replace with temp matches if match fixture has not been played yet
function processInitialState (data) {
    //Separate groups from knockout games
    const groupGames = data.rounds.slice(0, 15);
    let knockoutGames = data.rounds.slice(15, 18)
    knockoutGames.push(data.rounds[19]);

    const groupNames = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'];
    
    //Map over each group name and find matches in the api response with the same group name
    //Return with array of  objects of groups with group matches
    const groups = groupNames.map((name, i) => {
        let sortedGames = [];
        groupGames.filter((game, i) => {                 
          return game.matches.forEach(match => {
            //Add match confirmed prop if fixture has been played
            if (match.group === name) {
                match.confirmed = true;
                if (match.score1 === null) match.confirmed = false;
                sortedGames.push(match);
            }
          });
        });
        return { name: name, matches: sortedGames }    
    }); 

    //if no knockout games played replace api data with temp match data
    if (!knockoutGames[0]['matches'].length) {
        knockoutGames = tempMatches;
    }

    //Swap over 'Round of 16' matches so correct teams will meet in the next round
    function swapElement(array, indexA, indexB) {
        let temp = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = temp;
    }
    swapElement(knockoutGames[0]['matches'], 2, 4);
    swapElement(knockoutGames[0]['matches'], 3, 5);

    return { groupGames: groups, knockoutGames: knockoutGames }
}

export function fetchData(url) {
    return dispatch => {
        dispatch(loadingData(true));
        fetch(url)
            .then(response => {
                if (!response.ok) throw Error(response.statusText);           
                return response;
            })
            .then(response => response.json())
            .then(data => {
                const processedData = processInitialState(data);
                dispatch(groupsFetched(processedData.groupGames));
                dispatch(fetchKnockouts(processedData.knockoutGames));
            })
            .then(() => dispatch(loadingData(false)))
            .catch(() => dispatch(loadingError(true)));
    };
}
