import React, { Component } from 'react';
import { connect } from "react-redux";
import placeholderArray from '../js/placeholderData.js';

import GroupTable from './GroupTable.js';
import GroupGames from './GroupGames.js';
import Knockout from './Knockout.js';
import PlaceholderMatch from './PlaceholderMatch.js';
import KnockoutMatch from './KnockoutMatch.js';
import { itemsFetchData } from '../actions/index';

const GAMES_API = 'https://raw.githubusercontent.com/openfootball/world-cup.json/master/2018/worldcup.json';

const advance = [
       {
           round: "Last 16",
           matches: [
               { group: 0, num: [ 50, 51 ] },
               { group: 1, num: [ 51, 50 ] },
               { group: 2, num: [ 49, 52 ] },
               { group: 3, num: [ 52, 49 ] },
               { group: 4, num: [ 53, 55 ] },
               { group: 5, num: [ 55, 53 ] },
               { group: 6, num: [ 54, 56 ] },
               { group: 7, num: [ 56, 54 ] },
           ]
       },
       {
           round: "Quarter Finals",
           matches: [
               { group: 0, num: 57, index: 0 },
               { group: 1, num: 57, index: 1 },
               { group: 2, num: 58, index: 0 },
               { group: 3, num: 58, index: 1 },
               { group: 4, num: 59, index: 0 },
               { group: 5, num: 59, index: 1 },
               { group: 6, num: 60, index: 0 },
               { group: 7, num: 60, index: 1 }
           ]
       },
       {
           round: "Semi Finals",
           matches: [
              { group: 0, num: 61, index: 0 },
               { group: 1, num: 61, index: 1 },
               { group: 2, num: 62, index: 0 },
               { group: 3, num: 62, index: 1 }
           ]
       },
        {
           round: "Final",
           matches: [
               { group: 0, num: 64, index: 0 },
               { group: 1, num: 64, index: 1 }
           ]
       },
       {
           round: "Final",
           matches: [
               { group: 0, num: 64, index: 0 },
               { group: 1, num: 64, index: 1 }
           ]
       },
   ];

const mapStateToProps = (state) => {
  return {
    items: state.items,
    knockouts: state.knockouts,
    hasErrored: state.itemsHasErrored,
    isLoading: state.itemsIsLoading
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: (url) => dispatch(itemsFetchData(url))
  };
};

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
      loadedGames: true,
      loadedGroups: false,
      showInfo: true
    }
    this.toggleRound = this.toggleRound.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
  }

  componentDidMount() {
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
    if (this.props.hasErrored) {
      return <p>Sorry! There was an error loading the items</p>;
    }

    if (this.props.isLoading) {
        return <p>Loading…</p>;
    }

    let stage;
    if (this.props.items && this.props.knockouts.length) {

      //Sort Group Links
      const links = this.props.items.map((el, i) => {
        const letter = el.name[el.name.length - 1].toLowerCase();
        return <a key={i} href={"#group-" + letter}>{letter.toUpperCase()}</a>
      });


        const groups = this.props.items.map((el, i) => {
          const games = el.matches.map((data, j) => <GroupGames key={j} group={i} index={j}/> );
          let first;
          let second;
          advance[0]['matches'].filter(a => {
            if (a.group === i) { 
              first = a.num[0];
              second = a.num[1];
            }
          })
          return (
            <div key={i} 
                 id={"group-" + (el.name[el.name.length - 1]).toLowerCase()} 
                 className="group">
              <GroupTable key={i} name={el.name} first={first} second={second} data={el} index={i}/>
              { games }
            </div>
          )
        })
       
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
    
      const knockoutStage = (
        <div className="knockout-container">
          {knockoutRounds}
        </div>
      );

      const groupStage = (
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

      stage = this.state.knockout ? knockoutStage : groupStage;
   }

   const show  = stage ? stage : '';

   const infoPanel = (
     <div className="info-panel">
        <i onClick={this.closeInfo} className="fas fa-times"></i>
        <p>API updated daily <a href="https://github.com/openfootball/world-cup.json">https://github.com/openfootball/world-cup.json</a></p>
        <p>All Kickoff Times (UTC +00:00)</p>
      </div>
   );

    return (
      <div className="app">
      <h1 className="title">World Cup 2018 Russia</h1>
        <div className="title-flag-container">    
          <div className="title-flag">
            <div>
              <hr className="stripe white-stripe"/>
              <hr className="stripe blue-stripe"/>
              <hr className="stripe"/>
            </div>
          </div>
        </div>
        {this.state.showInfo && infoPanel}
    
        <div className="container">      
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
