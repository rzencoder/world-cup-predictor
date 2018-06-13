import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../flagCodes.js';

const dateFormater = date => {
  const dateArray = date.split('-');
  if (dateArray[1].charAt(0) === '0'){
    dateArray[1] = dateArray[1].slice(1);
  }
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return dateArray[2] + ' ' + months[dateArray[1]] + ' ' + dateArray[0]
}

class GroupGames extends Component {
 
  render() {
    console.log(this.props.data)
    let awayScorers = [];
    let homeScorers = []
    if(this.props.data.goals){
      homeScorers = this.props.data.goals.filter(el => {
      if(el.team.name === this.props.data.team1.name) {
        return el;
      }
      else {
        awayScorers.push(el)
      }
    }).map((el, i) => {
      return <div key={'a'+i}>'{el.minute} {el.name}</div>
    })
    awayScorers = awayScorers.map((el, i) => {
      console.log('a')
      return <div key={'b' + i}>'{el.minute} {el.name}</div>
    })
  }
    console.log(homeScorers)
    console.log(awayScorers)
    
     const score = (
        <span className="match-time">{this.props.data.score1} : {this.props.data.score2}</span>
      );
      const time = (
        <span className="match-time">{this.props.data.time}</span>
      );
      const displayScoreOrTime = this.props.data.score1 === null ? time : score 
      return (
      <div className="group-match-container">    
        <div className="group-match-date">{dateFormater(this.props.data.date)}</div>
        <div className="group-match-teams">
          <div className="team-name">
            <div className="country-name">{this.props.data.team1.name}</div>
            <div className="scorers">{homeScorers}</div>            
          </div>
          {displayScoreOrTime}
          <div className="team-name">
            <div className="country-name">{this.props.data.team2.name}</div>
            <div className="scorers">{awayScorers}</div>            
          </div>
        </div>
        <div className="match-location"> <br/> {this.props.data.city}</div>
      </div>
    );
  }
}

export default GroupGames;