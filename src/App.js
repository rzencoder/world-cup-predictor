import React, { Component } from 'react';
import GroupTable from './components/GroupTable.js';
import GroupGames from './components/GroupGames.js';
import Knockout from './components/Knockout.js';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import PlaceholderMatch from './components/PlaceholderMatch.js';
import KnockoutMatch from './components/KnockoutMatch.js';

const placeholderArray = [
    { round: "Last 16",  matches: [
        { date: "30th June",  team1: "C1", team2: "D2", stadium: "Kazan Arena", location: "Kazan" },
        { date: "30th June",  team1: "A1", team2: "B2", stadium: "Fisht Olympic Stadium", location: "Sochi" },
        { date: "2nd July",  team1: "E1", team2: "F2", stadium: "Samara Arena", location: "Samara" },
        { date: "2nd July",  team1: "G1", team2: "H2", stadium: "Rostov Arena", location: "Rostov-on-Don" },
        { date: "1st July",  team1: "B1", team2: "A2", stadium: "Luzhniki Stadium", location: "Moscow" },
        { date: "1st July",  team1: "D1", team2: "C2", stadium: "Nizhny Novgorod Stadium", location: "Nizhny Novgorod" },
        { date: "3rd July",  team1: "F1", team2: "E2", stadium: "Krestovsky Stadium", location: "Saint Petersburg" },
        { date: "3rd July",  team1: "H1", team2: "G2", stadium: "Otkrytie Arena", location: "Moscow" },
     ]},
     { round: "Quarter Finals",  matches: [
        { date: "6th July",  team1: "QF1", team2: "QF2", stadium: "Nizhny Novgorod Stadium", location: "Nizhny Novgorod" },
        { date: "6th July",  team1: "QF5", team2: "QF6", stadium: "Kazan Arena", location: "Kazan" },
        { date: "7th July",  team1: "QF3", team2: "QF4", stadium: "Fisht Olympic Stadium", location: "Sochi" },
        { date: "7th July",  team1: "QF7", team2: "QF8", stadium: "Samara Arena", location: "Samara" }
     ]},
     { round: "Semi Finals",  matches: [
        { date: "10th July",  team1: "SF1", team2: "SF2", stadium: "Krestovsky Stadium", location: "Saint Petersburg" },
        { date: "11th July",  team1: "SF3", team2: "SF4", stadium: "Luzhniki Stadium", location: "Moscow" }
     ]},
     { round: "Final",  matches: [
        { date: "15th July",  team1: "FINAL1", team2: "FINAL2", stadium: "Luzhniki Stadium", location: "Moscow" }
     ]}  
];

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
    axios.get('https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json')
      .then((response) => {
        console.log(response.data.rounds)
        this.setState({
          games: response.data.rounds,
          loadedGames: true
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getGroups () {
    axios.get('https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.standings.json')
      .then((response) => {
        this.setState({
          groups: response.data.groups,
          loadedGroups: true
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  toggleRound () {
    this.setState({
      knockout: !this.state.knockout
    })
  }

  render() {
    let stage;
    if(this.state.loadedGames && this.state.loadedGroups){
    const games = this.state.games.slice(0, 15);   
    const knockoutGames = this.state.games.slice(15, 18)
    knockoutGames.push(this.state.games[19]);
    console.log(knockoutGames)
    const groups = this.state.groups.map((el, i) => {
      const a = [];
      const groupMatches = games.filter((d,i) => {      
        d.matches.forEach(m => {
          if(m.group === el.name) a.push(m);
        });
      });    
      const groupGames = a.map((f, i) => <GroupGames key={i} data={f} /> )

      return (
        <div id={"group-" + (el.name[el.name.length - 1]).toLowerCase()} className="group">
          <GroupTable key={i} data={el} />
          { groupGames }
        </div>
      )
    });
    const links = this.state.groups.map(el => {
      const letter = el.name[el.name.length - 1].toLowerCase();
      return <a href={"#group-" + letter}>{letter.toUpperCase()}</a>
    })
        const placeholderGames = placeholderArray.map(round => {
     return { matches:
      round.matches.map(match => {
          return <PlaceholderMatch data={match} />
        })
    }
    });

    let knockoutList;
    console.log(placeholderGames)
    if(knockoutGames.length > 1){
    knockoutList = placeholderGames.map((round, i) => {
      return round.matches.map((el, j) => {
        if(knockoutGames[i]['matches'][j]){
        return <KnockoutMatch key={j} data={knockoutGames[i]['matches'][j]}/>
      } else {
        return el;
      }
    })
    })
}   
    console.log(knockoutList)
    const knockoutRounds = knockoutList.map((el,i) => {
      return <Knockout data={el} round={i} />
    })
   
    const knockoutStage = (
      <div class="knockout-container">
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
        <hr class="blue-stripe"/>
        <hr/>
        <div className="app">
         
          <div class="round-selector">
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
