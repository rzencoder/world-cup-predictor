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

  /* Map over each knockout round and each match in round. If the api provides a match
  replace the temp match with the api match. Add a confirmed value if the match has finished */
  const knockoutMatches = tempMatches.map((round, i) => {
    const roundMap = round.matches.map((match) => {
      if (knockoutGames[i].matches.length) {
        const foundMatch = knockoutGames[i].matches.find(el => el.num === match.num);
        if (foundMatch) {
          if (foundMatch.score1 !== null) {
            foundMatch.confirmed = true;
          } else {
            foundMatch.confirmed = false;
          }
          return foundMatch;
        }
      }
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

  swapElement(knockoutMatches[0].matches, 2, 5);
  swapElement(knockoutMatches[0].matches, 3, 4);

  return {
    groupGames: groups,
    knockoutGames: knockoutMatches,
  };
};

export default processInitialState;
