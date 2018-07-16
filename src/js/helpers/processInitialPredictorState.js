/* Organize data collected from api and remove goals to create template for predictor */
const processInitialPredictorState = (data) => {
  // Separate groups from knockout games
  const groupGames = data.rounds.slice(0, 15);
  const knockoutGames = data.rounds.slice(15, 18);
  knockoutGames.push(data.rounds[19]);
  const groupNames = ['Group A', 'Group B', 'Group C', 'Group D', 'Group E', 'Group F', 'Group G', 'Group H'];

  // Map over each group name and find matches in the api response with the same group name
  // Return with array of  objects of groups with group matches
  const groups = groupNames.map((name) => {
    const sortedGames = [];
    groupGames.filter(game => game.matches.forEach((match) => {
      // Remove goals data
      if (match.group === name) {
        match.confirmed = false;
        match.score1 = null;
        match.score2 = null;
        match.goals1 = null;
        match.goals2 = null;
        sortedGames.push(match);
      }
    }));
    return { name, matches: sortedGames };
  });

  /* Map over each knockout round and each match in round. */
  const knockoutMatches = knockoutGames.map((round) => {
    const roundMap = round.matches.map((match) => {
      match.confirmed = false;
      match.score1 = null;
      match.score2 = null;
      match.score1et = null;
      match.score2et = null;
      match.goals1 = null;
      match.goals2 = null;
      match.team1.name = null;
      match.team2.name = null;
      match.team1.code = null;
      match.team2.code = null;
      return match;
    });
    return { name: round.name, matches: roundMap };
  });

  // Swap over 'Round of 16' matches so correct teams will meet in the next round
  function swapElement(array, indexA, indexB) {
    const temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
  }

  swapElement(knockoutMatches[0].matches, 2, 4);
  swapElement(knockoutMatches[0].matches, 3, 5);
  return {
    groupGames: groups,
    knockoutGames: knockoutMatches,
  };
};

export default processInitialPredictorState;
