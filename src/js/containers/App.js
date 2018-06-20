import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import GroupTable from './GroupTable.js';
import GroupGames from './GroupGames.js';
import Knockout from './Knockout.js';
import KnockoutMatch from './KnockoutMatch.js';
import Header from '../components/Header.js';

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

  toggleRound (e) {
    const toggle = e.target.id === "knockoutToggle";
    this.setState({
      knockout: toggle
    });
  }

  closeInfo = () => {
    this.setState({
      showInfo: false
    });
  }

  renderGroups () {
    //Sort Group Links
    const links = this.props.groups.map((el, i) => {
      const letter = el.name[el.name.length - 1].toLowerCase();
      return <a key={i} href={"#group-" + letter}>{letter.toUpperCase()}</a>
    });

    const groups = this.props.groups.map((el, i) => {
      const games = el.matches.map((data, j) => <GroupGames data={data} key={j} group={i} index={j}/> );
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

    return (
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

  renderKnockouts () {
    const knockoutGames = this.props.knockouts;
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
    });

    return (
      <div className="knockout-container">
        {knockoutRounds}
      </div>
    );
  }

  render () {
    if (this.props.loadingError) {
      return <p>Sorry! There was an error loading the data</p>;
    }
    if (this.props.isLoading) {
        return (
          <div className="loader">
            <div></div>
          </div>
      );
    }

    const displayStage = !this.state.knockout ? this.renderGroups() : this.renderKnockouts();

    return (
      <div className="app">
        <Header 
          showInfo={this.state.showInfo}
          closeInfo={this.closeInfo}    
          knockout={this.state.knockout}
          toggleRound={this.toggleRound}    
        />
        <div className="container">
          { displayStage }
        </div>
      </div>
    );
  }
}

App.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  loadingError: PropTypes.bool.isRequired,
  groups: PropTypes.array.isRequired,
  knockouts: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
