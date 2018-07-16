import processInitialState from '../helpers/processInitialState';
import processInitialPredictorState from '../helpers/processInitialPredictorState';
import { KNOCKOUT_DATA_FETCHED, UPDATE_QUALIFIER, UPDATE_KNOCKOUT,
  UPDATE_SCORE, DATA_FETCHED, LOADING_DATA, LOADING_ERROR, REMOVE_TEAM,
  UPDATE_CHAMPIONS, REMOVE_CHAMPIONS } from '../constants/action-types';

export function loadingError(bool) {
  return {
    type: LOADING_ERROR,
    isError: bool,
  };
}

export function loadingData(bool) {
  return {
    type: LOADING_DATA,
    isLoading: bool,
  };
}

function updateQual(teams, index1, index2, round) {
  return {
    type: UPDATE_QUALIFIER,
    teams,
    index1,
    index2,
    round,
  };
}

export function updateQualifier(teams, index1, index2, round) {
  return (dispatch) => {
    dispatch(updateQual(teams, index1, index2, round));
  };
}

function removeMatch(round, match, home) {
  return {
    type: REMOVE_TEAM,
    round,
    match,
    home,
  };
}

export function removeTeam(round, match, home) {
  return (dispatch) => {
    dispatch(removeMatch(round, match, home));
  };
}

function removeChamps(team) {
  return {
    type: REMOVE_CHAMPIONS,
    team,
  };
}

export function removeChampions(team) {
  return (dispatch) => {
    dispatch(removeChamps(team));
  };
}

function updateChamps(team) {
  return {
    type: UPDATE_CHAMPIONS,
    team,
  };
}

export function updateChampions(team) {
  return (dispatch) => {
    dispatch(updateChamps(team));
  };
}

function updateKnock(teams, index1, round, home) {
  return {
    type: UPDATE_KNOCKOUT,
    teams,
    index1,
    round,
    home,
  };
}

export function updateKnockout(teams, index1, round, home) {
  return (dispatch) => {
    dispatch(updateKnock(teams, index1, round, home));
  };
}

export function updateGoal(group, index, score, home) {
  return {
    type: UPDATE_SCORE,
    group,
    index,
    score,
    home,
  };
}

export function updateScore(group, index, score, home) {
  return (dispatch) => {
    dispatch(updateGoal(group, index, score, home));
  };
}

export function groupsFetched(data) {
  return {
    type: DATA_FETCHED,
    data,
  };
}

export function fetchKnockouts(data) {
  return {
    type: KNOCKOUT_DATA_FETCHED,
    data,
  };
}

export function fetchData(url) {
  return (dispatch) => {
    dispatch(loadingData(true));
    fetch(url)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response;
      })
      .then(response => response.json())
      .then((data) => {
        const processedData = processInitialState(data);
        dispatch(groupsFetched(processedData.groupGames));
        dispatch(fetchKnockouts(processedData.knockoutGames));
      })
      .then(() => dispatch(loadingData(false)))
      .catch(() => dispatch(loadingError(true)));
  };
}

export function fetchPredictor(url) {
  return (dispatch) => {
    dispatch(loadingData(true));
    fetch(url)
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response;
      })
      .then(response => response.json())
      .then((data) => {
        const processedData = processInitialPredictorState(data);
        dispatch(groupsFetched(processedData.groupGames));
        dispatch(fetchKnockouts(processedData.knockoutGames));
      })
      .then(() => dispatch(loadingData(false)))
      .catch(() => dispatch(loadingError(true)));
  };
}
