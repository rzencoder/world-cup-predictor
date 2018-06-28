import { tempMatches } from '../data/matchData';

/* Organize data collected from api and replace with temp matches
if match fixture has not been played yet */
const processInitialState = (data) => {
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
      // Add match confirmed prop if fixture has been played
      if (match.group === name) {
        match.confirmed = true;
        if (match.score1 === null) match.confirmed = false;
        sortedGames.push(match);
      }
    }));
    return { name, matches: sortedGames };
  });

  const knockoutMatches = tempMatches.map((round, i) => {
    const roundMap = round.matches.map((match, j) => {
      if (knockoutGames[i].matches.length) {
        if (knockoutGames[i].matches[j]) {
          if (knockoutGames[i].matches[j].score1 !== null) {
            knockoutGames[i].matches[j].confirmed = true;
          } else {
            knockoutGames[i].matches[j].confirmed = false;
          }
          return knockoutGames[i].matches[j];
        }
      }
      return match;
    });
    return { name: round.name, matches: roundMap };
  });

  // if (knockoutGames[0].matches.length) {
  //   knockoutGames.forEach((round) => {
  //     round.matches.forEach((match) => {
  //       if (match.score1 !== null) {
  //         match.confirmed = true;
  //       } else {
  //         match.confirmed = false;
  //       }
  //     });
  //   });
  // }

  // if no knockout games played replace api data with temp match data
  // if (!knockoutGames[0].matches.length) {
  //   knockoutGames = tempMatches;
  // }

  // Swap over 'Round of 16' matches so correct teams will meet in the next round
  function swapElement(array, indexA, indexB) {
    const temp = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = temp;
  }

  swapElement(knockoutMatches[0].matches, 5, 6);
  return {
    groupGames: groups,
    knockoutGames: knockoutMatches,
  };
};

export default processInitialState;
