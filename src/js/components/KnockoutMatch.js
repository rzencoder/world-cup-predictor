import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import FlagIcon from './FlagIcon.js';
import codeConverter from '../data/flagCodes.js';
import HoverInfo from './HoverInfo.js';
import dateFormater from '../helpers/dateFormater.js';
import { updateKnockout, removeTeam } from '../actions/index';

const mapStateToProps = state => {
  return {
    knockouts: state.knockouts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateKnockout: (teams, index1, round, home) => dispatch(updateKnockout(teams, index1, round, home)),
    removeTeam: (round, match, home) => dispatch(removeTeam(round, match, home))
  };
};

class KnockoutMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeScore: '',
      awayScore: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.calculateResult = this.calculateResult.bind(this);
    this.changeScoreClick = this.changeScoreClick.bind(this);
    this.score1Input = React.createRef();
    this.score2Input = React.createRef();
  }

  componentDidMount() {
    //If a match has an actual result then calculate which team progressed
    if(this.props.data.score1 && this.props.data.score2){
      this.calculateResult();
    }
  }

  handleInputChange (e) {
    this.setState({
      [e.target.name]: e.target.value
    }, () => this.calculateResult());
  }

  calculateResult () {
    //TO DO FIX 64 bug
    if (this.props.data.num !== 64) {
      // Use actual score if match completed instead of prediction
      const homeScore = this.props.data.score1 ? this.props.data.score1 : this.state.homeScore;
      const awayScore = this.props.data.score2 ? this.props.data.score2 : this.state.awayScore;
       // If result >= 0 home team won
      const result = homeScore - awayScore;
      const team = result >= 0 ? this.props.data.team1 : this.props.data.team2;
      const losingTeam = result >= 0 ? this.props.data.team2 : this.props.data.team1;
      const teams = [{name: team.name, code: team.code}];

      let firstIndex;
      // Find which match winner will play next
      this.props.knockouts[this.props.round]['matches'].filter((el, i) => {
        if (this.props.first === el.num) firstIndex = i;
        return null;
      });

      const home = 'team' + this.props.home;
      this.checkFutureRounds(losingTeam);
      this.props.updateKnockout(teams, firstIndex, this.props.round, home);
      
    }
  }

  changeScoreClick (e) {
    //Check if user increased or decreased score
    const incOrDec = e.target.className;
    //Check using refs is the home or away team was clicked
    const id = e.currentTarget.parentNode.id;
    const ref = id === 'home' ? this.score1Input.current.value : this.score2Input.current.value
    // If value was empty convert to 0
    const input = ref === "" ? 0 : ref;
    // Add or remove 1 and prevent negative number;
    let value = incOrDec === "up" ? parseInt(input, 10) + 1 : parseInt(input, 10) - 1;
    value = value < 0 ? 0 : value;

    const name = id + 'Score';
    this.setState({
      [name]: value
    }, () => this.calculateResult());
  }

  calculateScore (data, i) {
    if (data['score' + i + 'et'] !== null) {
      const extra = i === 1 ? 'AET ' : '';
      if (data.score1et !== data.score2et) {
        return extra + data['score' + i + 'et'];
      } else {
        return extra + data['score' + i + 'et'] + ' (' + data['score' + i] + ')';
      }
    }
    return data['score' + i];
  }

  checkFutureRounds (losingTeam) {

    const knockouts = [...this.props.knockouts];
    const removeTeamArr = [];

    knockouts.forEach((round, i) => {
      if(i > this.props.round) {
        round.matches.forEach((match, j) => {
          if (losingTeam.name === match.team1.name) {
            removeTeamArr.push({ round: i, match: j, home: 'team1' });
          }
          if (losingTeam.name === match.team2.name) {
            removeTeamArr.push({ round: i, match: j, home: 'team2' });
          }
        });
      }
    });

    if (removeTeamArr.length) {
      removeTeamArr.forEach(el => {
        this.props.removeTeam(el.round, el.match, el.home);
      });
    }
  }

  render() {
    //Render Goalscorer list
    let awayScorers = [];
    let homeScorers = [];     
    if (this.props.data.goals1) {
      homeScorers = this.props.data.goals1.map((el, i) => {
        return <div key={i}><i className="fas fa-futbol"></i> '{el.minute} {el.name}</div>
      });
      awayScorers = this.props.data.goals2.map((el, i) => {
        return <div key={i}><i className="fas fa-futbol"></i> '{el.minute} {el.name}</div>
      });
    }
    
    const homePrediction = (
      <div id="home" className="knockout-prediction">
        <div onClick={this.changeScoreClick} className="down">-</div>
        <div>
          <input name="homeScore"
              type="number"
              ref={this.score1Input}
              value={this.state.homeScore}
              onChange={this.handleInputChange} 
              min="0"/>
        </div>
        <div onClick={this.changeScoreClick} className="up">+</div>
      </div>
    );

    const awayPrediction = (
      <div id="away" className="knockout-prediction">
        <div onClick={this.changeScoreClick} className="down">-</div>
        <div>
          <input name="awayScore"
              type="number"
              ref={this.score2Input}
              value={this.state.awayScore}
              onChange={this.handleInputChange} 
              min="0"/>
        </div>
        <div onClick={this.changeScoreClick} className="up">+</div>
      </div>
    );

    return (
      <div className = "knockout-match bracket-team" >
        <div className="knockout-date">{dateFormater(this.props.data.date)}</div>
        <div className="knockout-teams">
          <div className="knockout-team">
            <div>
              {this.props.data.team1.name === null ? "" : <FlagIcon code={codeConverter(this.props.data.team1.code)} size={'2x'} />}
              <div className="knockout-country-name">
                <div>
                {this.props.data.team1.name !== null ? this.props.data.team1.name : this.props.data.team1.position}
                </div>
                {homeScorers.length ? <HoverInfo data={homeScorers} /> : ''}
              </div>   
              <div className="knockout-score">
                {this.props.data.score1 === null ? '' : <span>{this.calculateScore(this.props.data, 1)}</span>}
                {this.props.data.score1 === null && this.props.data.team1.name !== null 
                   && this.props.data.team2.name !== null ? homePrediction : '' }
              </div>
            </div>
            <div className="knockout-scorers">
              {homeScorers}
            </div>     
          </div>
          
          <div className="knockout-team">
            <div>
              {this.props.data.team2.name === null ? "" : <FlagIcon code={codeConverter(this.props.data.team2.code)} size={'2x'} />}
              <div className="knockout-country-name">
              {this.props.data.team2.name !== null ? this.props.data.team2.name : this.props.data.team2.position}
              </div>
              {awayScorers.length ? <HoverInfo data={awayScorers}/> : ''}
              <div className="knockout-score">
                {this.props.data.score2 === null ? '' : <span>{this.calculateScore(this.props.data, 2)}</span>}
                {this.props.data.score2 === null && this.props.data.team1.name !== null 
                   && this.props.data.team2.name !== null ? awayPrediction : '' }
              </div>
             </div>
             <div className="knockout-scorers">
              {awayScorers}
            </div>        
          </div>
        </div>
        <div className="knockout-stadium">{this.props.data.stadium ? this.props.data.stadium.name : '' }</div>
        <div className="knockout-location">{this.props.data.city}</div>
      </div>
    );
  }
}

KnockoutMatch.propTypes = {
  knockouts: PropTypes.array.isRequired,
  updateKnockout: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  first: PropTypes.number.isRequired,
  round: PropTypes.number.isRequired,
  home: PropTypes.number.isRequired,
  removeTeam: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(KnockoutMatch);