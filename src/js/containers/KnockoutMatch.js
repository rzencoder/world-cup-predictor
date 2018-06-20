import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import KnockoutGameComponent from '../components/KnockoutGameComponent.js';
import { updateKnockout, removeTeam, updateChampions, removeChampions } from '../actions/index';

const mapStateToProps = state => {
  return {
    knockouts: state.knockouts,
    champions: state.champions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateKnockout: (teams, index1, round, home) => dispatch(updateKnockout(teams, index1, round, home)),
    removeTeam: (round, match, home) => dispatch(removeTeam(round, match, home)),
    updateChampions: team => dispatch(updateChampions(team)),
    removeChampions: team => dispatch(removeChampions(team))
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
      // Use actual score if match completed instead of prediction
      console.log(this.props.round)
      if (this.props.round !== 4 && !this.props.knockouts[this.props.round  + 1]['matches'][0]['confirmed']) {
      const homeScore = this.props.data.score1 ? this.props.data.score1 : this.state.homeScore;
      const awayScore = this.props.data.score2 ? this.props.data.score2 : this.state.awayScore;
       // If result >= 0 home team won
      const result = homeScore - awayScore;
      const team = result >= 0 ? this.props.data.team1 : this.props.data.team2;
      const losingTeam = result >= 0 ? this.props.data.team2 : this.props.data.team1;
      const teams = [{name: team.name, code: team.code}];

      if (this.props.data.num !== 64) {
        let firstIndex;
        // Find which match Champions will play next
        this.props.knockouts[this.props.round]['matches'].filter((el, i) => {
          if (this.props.first === el.num) firstIndex = i;
          return null;
        });

        const home = 'team' + this.props.home;
        this.checkFutureRounds(losingTeam);
        console.log(teams)
        this.props.updateKnockout(teams, firstIndex, this.props.round, home);   
    } else {
        this.props.updateChampions(team);
    }
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

  checkFutureRounds (losingTeam) {
    const knockouts = [...this.props.knockouts];
    const removeTeamArr = [];
    knockouts.forEach((round, i) => {
      if(i >= this.props.round) {
        round.matches.forEach((match, j) => {
          if (losingTeam.name === match.team1.name) {
            removeTeamArr.push({ name: losingTeam.name, round: i, match: j, home: 'team1' });
          }
          if (losingTeam.name === match.team2.name) {
            removeTeamArr.push({ name: losingTeam.name, round: i, match: j, home: 'team2' });
          }
        });
      }
    });

    if (removeTeamArr.length) {
      removeTeamArr.forEach(el => {      
        this.props.removeTeam(el.round, el.match, el.home);       
        if (el.name === this.props.champions.name) {
          this.props.removeChampions(el);
        }
      });
    }
   
  }

  render() {
    return (
      <div className = "knockout-match bracket-team">
        <KnockoutGameComponent 
          data={this.props.data}
          changeScoreClick={this.changeScoreClick}
          handleInputChange={this.handleInputChange}
          score1Input={this.score1Input}
          score2Input={this.score2Input}
          homeScore={this.state.homeScore}
          awayScore={this.state.awayScore}
        />
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
  champions: PropTypes.object.isRequired,
  updateChampions: PropTypes.func.isRequired,
  removeChampions: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(KnockoutMatch);