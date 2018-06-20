import { tempMatches } from '../data/matchData';

// Organise data collected from api and replace with temp matches if match fixture has not been played yet
export const processInitialState = data => {
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

    if (knockoutGames[0]['matches'].length) {
        knockoutGames.forEach((round, i) => {              
            round.matches.forEach(match => {
                if (match.score1 !== null) {
                    match.confirmed = true;
                } else {
                    match.confirmed = false;
                }
            });
        });
    }

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