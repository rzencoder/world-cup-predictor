import React, { Component } from 'react';
import { connect } from "react-redux";

import GroupTable from './GroupTable.js';
import GroupGames from './GroupGames.js';
import Knockout from './Knockout.js';
import KnockoutMatch from './KnockoutMatch.js';

import { fetchData } from '../actions/index';
import { advance } from '../data/matchData';
import { GAMES_API } from '../constants/api';

const mapStateToProps = state => {
  return {
    groups: state.groups,
    knockouts: state.knockouts,
    loadingError: state.loadingError,
    isLoading: state.loadingData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(fetchData(url))
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      games: [],
      knockout: false,
      showInfo: true
    }
    this.toggleRound = this.toggleRound.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
  }

  componentDidMount () {
    this.props.fetchData(GAMES_API);
  }

  toggleRound () {
    this.setState({
      knockout: !this.state.knockout
    });
  }

  closeInfo = () => {
    this.setState({
      showInfo: false
    });
  }

  render() {

    if (this.props.loadingError) {
      return <p>Sorry! There was an error loading the data</p>;
    }

    if (this.props.isLoading) {
        return <p>Loading…</p>;
    }

    const infoPanel = (
      <div className="info-panel">
        <i onClick={this.closeInfo} className="fas fa-times"></i>
        <p>API updated daily <a href="https://github.com/openfootball/world-cup.json">https://github.com/openfootball/world-cup.json</a></p>
        <p>All Kickoff Times (UTC +00:00)</p>
      </div>
    );
    
    let groupContainer;
    let knockoutContainer;

    if (!this.state.knockout) {

      //Sort Group Links
      const links = this.props.groups.map((el, i) => {
        const letter = el.name[el.name.length - 1].toLowerCase();
        return <a key={i} href={"#group-" + letter}>{letter.toUpperCase()}</a>
      });

      const groups = this.props.groups.map((el, i) => {
        const games = el.matches.map((data, j) => <GroupGames key={j} group={i} index={j}/> );
        let first;
        let second;
        advance[0]['matches'].filter(a => {
          if (a.group === i) { 
            first = a.num[0];
            second = a.num[1];
          }
          return null;
        })
        return (
          <div key={i} 
                id={"group-" + (el.name[el.name.length - 1]).toLowerCase()} 
                className="group">
            <GroupTable key={i} name={el.name} first={first} second={second} data={el} index={i}/>
            { games }
          </div>
        )
      });

      groupContainer = (
        <div className="group-container">           
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
   }

   if (this.state.knockout) {

      let knockoutGames = this.props.knockouts;
      let knockoutList;
      if (knockoutGames.length > 1) {
        knockoutList = knockoutGames.map((round, i) => {
          return round.matches.map((el, j) => {
            const first = advance[i+1]['matches'][j]['num'];
            const home = advance[i + 1]['matches'][j]['index'];
            return <KnockoutMatch key={j} round={i + 1} first={first} home={home+1} data={knockoutGames[i]['matches'][j]}/>
          });
       });
      }   

      const knockoutRounds = knockoutList.map((el,i) => {
        return <Knockout key={i} data={el} round={i} />
      })
    
      knockoutContainer = (
        <div className="knockout-container">
          {knockoutRounds}
        </div>
      );

    }

    const displayStage = this.state.knockout ? knockoutContainer : groupContainer;

    return (
      <div className="app">
        <h1 className="title">World Cup 2018 Russia</h1>
        {this.state.showInfo && infoPanel} 
        <div className="container">      
          <div className="round-selector">
            <div className={this.state.knockout ? '' : "toggle" } onClick={this.toggleRound}>Groups</div>
            <div className={this.state.knockout ? "toggle" : '' } onClick={this.toggleRound}>Knockouts</div>
          </div>

          { displayStage }

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
