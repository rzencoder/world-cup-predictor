import React, { Component } from 'react';
import { connect } from "react-redux";
import FlagIcon from './FlagIcon.js';
import codeConverter from '../data/flagCodes.js';
import HoverInfo from './HoverInfo.js';
import dateFormater from '../helpers/dateFormater.js';
import { updateKnockout } from '../actions/index';

const mapStateToProps = (state) => {
  return {
    items: state.items,
    knockouts: state.knockouts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateKnockout: (teams, index1, round, home) => dispatch(updateKnockout(teams, index1, round, home))
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
    this.updateTable = this.updateTable.bind(this);
    this.score1Input = React.createRef();
    this.score2Input = React.createRef();
  }

  componentDidMount() {
    if(this.props.data.score1 && this.props.data.score2){
      console.log('b')
      this.calculateResult();
    }
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    let home = name === 'homeScore' ? 1 : 2;
    this.setState({
      [name]: value
    }, () => this.calculateResult());

  }
  calculateResult () {
    if(this.props.data.num !== 64){
    const result = this.state.homeScore - this.state.awayScore;
    const team = result > 0 ? this.props.data.team1 : this.props.data.team2;
    const teams = [{name: team.name, code: team.code}];
    let firstIndex;
    this.props.knockouts[this.props.round]['matches'].filter((el, i) => {
       console.log(el.num);
      if (this.props.first === el.num) firstIndex = i;
    });
    const home = 'team' + this.props.home;

    this.props.updateKnockout(teams, firstIndex, this.props.round, home);
    this.checkFutureRounds(teams)
  }
  }

  checkFutureRounds () {

  }


  updateTable(value, home) {
    this.props.updateScore(this.props.group, this.props.index, value, home);
  }

  changeScoreClick(e) {
    const incOrDec = e.target.className;
    const id = e.currentTarget.parentNode.id;
    const ref = id === 'home' ? this.score1Input.current.value : this.score2Input.current.value
    const input = ref === "" ? 0 : ref;
    let value = incOrDec === "up" ? parseInt(input) + 1 : parseInt(input) - 1;
    value = value < 0 ? 0 : value;
    const name = id + 'Score';
    const home = id === 'home' ? 1 : 2;
    this.setState({
      [name]: value
    }, () => this.calculateResult());
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

      //Calculate Match score extra time and penalties
      // i 1 or 2 for home/away side
      const calculateScore = (data, i) => {
        if (data['score' + i + 'et'] !== null) {
          const extra = i === 1 ? 'AET ' : '';
          if (data.score1et !== data.score2et) {
            return extra + data['score' + i + 'et'];
          } else {
              return extra + data['score' + i + 'et'] + ' (' + data['score' + i] + ')';
          }
        }
        return data['score' + i];
      };
      
      const homePrediction = (
        <div id="home" class="knockout-prediction">
          <div onClick={(e) => {this.changeScoreClick(e)}} className="down">-</div>
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
      <div id="away" class="knockout-prediction">
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
      console.log(this.props.data)
      return (
      < div className = "knockout-match bracket-team" >
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
                {this.props.data.score1 === null ? '' : <span>{calculateScore(this.props.data, 1)}</span>}
                {this.props.data.score1 === null ? homePrediction : ''}
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
                {this.props.data.score1 === null ? '' : <span>{calculateScore(this.props.data, 2)}</span>}
                {this.props.data.score1 === null ? awayPrediction : ''}
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

export default connect(mapStateToProps, mapDispatchToProps)(KnockoutMatch);