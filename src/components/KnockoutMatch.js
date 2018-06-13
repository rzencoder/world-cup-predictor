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

class KnockoutMatch extends Component {
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
      return <div key={'a'+i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
    })
    awayScorers = awayScorers.map((el, i) => {
      return <div key={'b' + i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
    })
  }
     const score = (
        <span>{this.props.data.score1}</span>
      );
      const time = (
        <span className="match-time">{this.props.data.time}</span>
      );
      const displayScoreOrTime = this.props.data.score1 === null ? time : score 
      return (
      <div className="knockout-match">  
      <h2>{this.props.data.name}</h2>  
        <div className="knockout-date">{dateFormater(this.props.data.date)}</div>
        <div className="knockout-teams">
          <div className="knockout-team">
            <FlagIcon code={codeConverter(this.props.data.team1.code)} size={'2x'} />
            <div className="knockout-country-name">{this.props.data.team1.name}</div>   
            <div className="knockout-score">{displayScoreOrTime}</div>     
          </div>
          
          <div className="knockout-team">
            <FlagIcon code={codeConverter(this.props.data.team2.code)} size={'2x'} />
            <div className="knockout-country-name">{this.props.data.team2.name}</div>
             <div className="knockout-score">{displayScoreOrTime}</div>    
          </div>
        </div>
        <div className="knockout-match-location">{this.props.data.city}</div>
      </div>
    );
  }
}

export default KnockoutMatch;