import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import dateFormater from '../helpers/dateFormater.js';
import { updateScore } from '../actions/index';

const mapStateToProps = state => {
  return {
    groups: state.groups
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateScore: (group, index, score, home) => dispatch(updateScore(group, index, score, home))
  };
};

class GroupGames extends Component {

  constructor (props) {
    super(props);
    this.state = {
      homeScore: '',
      awayScore: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.changeScoreClick = this.changeScoreClick.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.score1Input = React.createRef();
    this.score2Input = React.createRef();
  }

  handleInputChange (e) {
    const name = e.target.name;
    const home = name === 'homeScore' ? 1 : 2;  
    this.setState({
      [name]: e.target.value
    }, () => this.updateTable(e.target.value, home));
  }

  updateTable (value, home) {
    this.props.updateScore(this.props.group, this.props.index, value, home);
  }

  changeScoreClick (e) {
    // Check if user increased or decreased score
    const incOrDec = e.target.className;
    // Check using refs is the home or away team was clicked
    const id = e.currentTarget.parentNode.id;
    const ref = id === 'home' ? this.score1Input.current.value : this.score2Input.current.value;
    // If value was empty convert to 0
    const input = ref === "" ? 0 : ref;
    // Add or remove 1 and prevent negative number;
    let value = incOrDec === "up" ? parseInt(input, 10) + 1 : parseInt(input, 10) - 1;
    value = value < 0 ? 0 : value;
    const name = id + 'Score';
    const home = id === 'home' ? 1 : 2;
    this.setState({
      [name]: value
    }, () => this.updateTable(value, home));
  }
  
  render() {

    const data = this.props.groups[this.props.group]['matches'][this.props.index];

    //If goals scored display list of scorers
    let homeScorers = [];
    let awayScorers = [];
    if (data.goals1 || data.goals2) {
      homeScorers = data.goals1.map((el, i) => {
        return <div key={i}><i className="fas fa-futbol"></i> '{el.minute} {el.name}</div>
      });
      awayScorers = data.goals2.map((el, i) => {
        return <div key={i}><i className="fas fa-futbol"></i> '{el.minute} {el.name}</div>
      });
    }   

    const score = <span className="group-time">{data.score1} : {data.score2}</span>;

    const prediction = (
      <div className="prediction-container">
        <div id="home">
          <div onClick={this.changeScoreClick} className="up"></div>
          <div>
            <input name="homeScore"
                type="number"
                ref={this.score1Input}
                value={this.state.homeScore}
                onChange={this.handleInputChange} 
                min="0"/>
          </div>
          <div onClick={(e) => {this.changeScoreClick(e)}} className="down"></div>
        </div>
        <div id="away">
          <div onClick={this.changeScoreClick} className="up"></div>
          <div>
            <input name="awayScore"
                type="number"
                ref={this.score2Input}
                value={this.state.awayScore}
                onChange={this.handleInputChange} 
                min="0"/>
          </div>
          <div onClick={this.changeScoreClick} className="down"></div>
        </div>
      </div>
    )

    const displayScoreOrTime = data.confirmed  ? score : prediction;
    const predictClass = data.confirmed ? "" : "predict";
    
    return (
      <div className="group-match-container">    
        <div>
          <div className="group-date">{dateFormater(data.date)}</div>
          <div className={"group-teams " + predictClass}>
            <div className="group-team">
              <div className="group-country-name">{data.team1.name}</div>
              <div className="group-scorers">{homeScorers}</div>            
            </div>
            {displayScoreOrTime}
            <div className="group-team">
              <div className="group-country-name">{data.team2.name}</div>
              <div className="group-scorers">{awayScorers}</div>        
            </div>
          </div>
        </div>
        <div>
          <div className="group-stadium">{data.stadium ? data.stadium.name : '' }</div>
          <div className="group-location">{data.city}</div>
          <hr className="group-line"/>  
        </div>
      </div>
    );
  }
}

GroupGames.propTypes = {
  groups: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  group: PropTypes.number.isRequired,
  updateScore: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupGames);