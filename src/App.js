import React, { Component } from 'react';
import GroupTable from './components/GroupTable.js';
import GroupGames from './components/GroupGames.js';
import logo from './logo.svg';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      games: []
    }
    this.getGroups = this.getGroups.bind(this)
  }

  componentDidMount() {
    this.getGroups();
    this.getGames();
  }

  getGames() {
    axios.get('https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json')
      .then((response) => {
        
        this.setState({
          games: response.data.rounds
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
          groups: response.data.groups
        })
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const games = this.state.games.slice(0, 15);   
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

    return (
      <div className="App">
        {links}
        {groups}
      </div>
    );
  }
}

export default App;
