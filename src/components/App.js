import React, { Component } from 'react';
import axios from 'axios';
import placeholderArray from '../js/placeholderData.js';

import GroupTable from './GroupTable.js';
import GroupGames from './GroupGames.js';
import Knockout from './Knockout.js';
import PlaceholderMatch from './PlaceholderMatch.js';
import KnockoutMatch from './KnockoutMatch.js';

const GROUP_API = 'https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.standings.json';
const GAMES_API = 'https://raw.githubusercontent.com/openfootball/world-cup.json/master/2014/worldcup.json';

const placeholderGames = placeholderArray.map(round => {
  return { matches:
    round.matches.map((match, i) => {
      return <PlaceholderMatch key={i} data={match} />
    })
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      games: [],
      knockout: false,
      loadedGames: false,
      loadedGroups: false
    }
    this.getGroups = this.getGroups.bind(this);
    this.toggleRound = this.toggleRound.bind(this)
  }

  componentDidMount() {
    this.getGroups();
    this.getGames();
  }

  getGames() {
    axios.get(GAMES_API)
      .then(response => {
        this.setState({
          games: response.data.rounds,
          loadedGames: true
        });
      })
      .catch(error => console.log(error));
  }

  getGroups () {
    axios.get(GROUP_API)
      .then((response) => {
        this.setState({
          groups: response.data.groups,
          loadedGroups: true
        })
      })
      .catch(error => console.log(error));
  }

  toggleRound () {
    this.setState({
      knockout: !this.state.knockout
    });
  }

  render() {
    let stage;
    if (this.state.loadedGames && this.state.loadedGroups) {

      //Sort Group Links
      const links = this.state.groups.map((el, i) => {
        const letter = el.name[el.name.length - 1].toLowerCase();
        return <a key={i} href={"#group-" + letter}>{letter.toUpperCase()}</a>
      });

      //Sorting data by round
      const groupGames = this.state.games.slice(0, 15);   
      const knockoutGames = this.state.games.slice(15, 18)
      knockoutGames.push(this.state.games[19]);

      //Sorting through games and mapping them to each group
      const groups = this.state.groups.map((el, i) => {
        const sortedGames = [];
        groupGames.filter((game, i) => {      
          return game.matches.forEach(match => {
            if(match.group === el.name) sortedGames.push(match);
          });
        });    
        const groupGamesComponentArray = sortedGames.map((data, i) => <GroupGames key={i} data={data} /> )
        return (
          <div key={i} id={"group-" + (el.name[el.name.length - 1]).toLowerCase()} className="group">
            <GroupTable key={i} data={el} />
            { groupGamesComponentArray }
          </div>
        )
      });

      let knockoutList;
      if (knockoutGames.length > 1) {
        knockoutList = placeholderGames.map((round, i) => {
          return round.matches.map((el, j) => {
            if (knockoutGames[i]['matches'][j]) {
             return <KnockoutMatch key={j} data={knockoutGames[i]['matches'][j]}/>
            } else {
              return el;
            }
          });
       });
      }   

      const knockoutRounds = knockoutList.map((el,i) => {
        return <Knockout key={i} data={el} round={i} />
      })
    
      const knockoutStage = (
        <div className="knockout-container">
          {knockoutRounds}
        </div>
      );
      const groupStage = (
        <div>           
          <div className="links">
            <div>Go to Group:</div>
            <div className="link-container">
              {links}
            </div>
          </div>
          <div className="group-stage">
            {groups}
          </div>
        </div>
      );

      stage = this.state.knockout ? knockoutStage : groupStage;
   }

   const show  = stage ? stage : '';

    return (
      <div>
        <h1>World Cup 2018 Russia</h1>
        <hr className="white-stripe"/>
        <hr className="blue-stripe"/>
        <hr/>
        <div className="app">      
          <div className="round-selector">
            <div className={this.state.knockout ? '' : "toggle" } onClick={this.toggleRound}>Groups</div>
            <div className={this.state.knockout ? "toggle" : '' } onClick={this.toggleRound}>Knockouts</div>
          </div>
          {show}
        </div>
      </div>
    );
  }
}

export default App;
