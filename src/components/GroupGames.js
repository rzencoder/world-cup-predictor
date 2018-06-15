import React, { Component } from 'react';
import dateFormater from '../js/dateFormater.js';

class GroupGames extends Component {
 
  render() {
    let homeScorers = [];
    let awayScorers = [];  

    if (this.props.data.goals1 || this.props.data.goals2) {
      homeScorers = this.props.data.goals1.map((el, i) => {
        return <div key={'a'+i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
      });
      awayScorers = this.props.data.goals2.map((el, i) => {
        return <div key={'b' + i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
      });
    }   

    const score = <span className="group-time">{this.props.data.score1} : {this.props.data.score2}</span>;
    const time = <span className="group-time">{this.props.data.time}</span>;
    const displayScoreOrTime = this.props.data.score1 === null ? time : score;

    return (
      <div className="group-match-container">    
        <div>
          <div className="group-date">{dateFormater(this.props.data.date)}</div>
          <div className="group-teams">
            <div className="group-team">
              <div className="group-country-name">{this.props.data.team1.name}</div>
              <div className="group-scorers">{homeScorers}</div>            
            </div>
            {displayScoreOrTime}
            <div className="group-team">
              <div className="group-country-name">{this.props.data.team2.name}</div>
              <div className="group-scorers">{awayScorers}</div>        
            </div>
          </div>
        </div>
        <div>
          <div className="group-stadium">{this.props.data.stadium ? this.props.data.stadium.name : '' }</div>
          <div className="group-location">{this.props.data.city}</div>
          <hr className="group-line"/>  
        </div>
      </div>
    );
  }
}

export default GroupGames;