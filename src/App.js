import React, { Component } from 'react';
import GroupTable from './components/GroupTable.js';
import GroupGames from './components/GroupGames.js';
import Knockout from './components/Knockout.js';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      games: [],
      knockout: false
    }
    this.getGroups = this.getGroups.bind(this);
    this.toggleRound = this.toggleRound.bind(this)
  }

  componentDidMount() {
    this.getGroups();
    this.getGames();
  }

  getGames() {
    axios.get('https://raw.githubusercontent.com/openfootball/world-cup.json/master/2014/worldcup.json')
      .then((response) => {
        console.log(response.data.rounds)
        this.setState({
          games: response.data.rounds
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  getGroups () {
    axios.get('https://raw.githubusercontent.com/openfootball/world-cup.json/master/2014/worldcup.standings.json')
      .then((response) => {
        this.setState({
          groups: response.data.groups
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
    let knockoutList;
    if(knockoutGames.length){
    console.log(knockoutGames)
    knockoutList = knockoutGames.map((el, i) => {
      return <Knockout key={i} data={el} />
    })
  }
    const knockoutStage = (
      <div class="knockout-container">
        {knockoutList}
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
    const stage = this.state.knockout ? knockoutStage : groupStage;
    return (
      <div className="app">
        <h1>World Cup 2018 Russia</h1>
        <button onClick={this.toggleRound}>Group Stage</button>
        {stage}
      </div>
    );
  }
}

export default App;
