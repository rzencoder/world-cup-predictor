import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../flagCodes.js';
import HoverInfo from './HoverInfo.js';


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
    
    let awayScorers = [];
    let homeScorers = []
    if(this.props.data.goals1){
      homeScorers = this.props.data.goals1.map((el, i) => {
      return <div key={'a'+i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
    })
    awayScorers = this.props.data.goals2.map((el, i) => {
      return <div key={'b' + i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
    })
  }


     const score = data => {
        return <span>{data}</span>
      };
      return (
      <div className="knockout-match"> 
        <div className="knockout-date">{dateFormater(this.props.data.date)}</div>
        <div className="knockout-teams">
          <div className="knockout-team">
            <div>
              <FlagIcon code={codeConverter(this.props.data.team1.code)} size={'2x'} />
              <div className="knockout-country-name">
                <div>{this.props.data.team1.name}</div>
                {homeScorers.length ? <HoverInfo data={homeScorers} /> : ''}
              </div>   
              <div className="knockout-score">
                {this.props.data.score1 === null ? '' : score(this.props.data.score1)}
                {this.props.data.score1et === null ? '' : score(this.props.data.score1et)}
              </div>
            </div>
            <div class="knockout-scorers">
              {homeScorers}
            </div>     
          </div>
          
          <div className="knockout-team">
            <div>
              <FlagIcon code={codeConverter(this.props.data.team2.code)} size={'2x'} />
              <div className="knockout-country-name">{this.props.data.team2.name}</div>
              {awayScorers.length ? <HoverInfo data={awayScorers}/> : ''}
              <div className="knockout-score">
                {this.props.data.score2 === null ? '' : score(this.props.data.score2)}
                {this.props.data.score2et === null ? '' : score(this.props.data.score2et)}
              </div>
             </div>
             <div class="knockout-scorers">
              {awayScorers}
            </div>        
          </div>
        </div>
        <div className="knockout-match-location">{this.props.data.city}</div>
      </div>
    );
  }
}

export default KnockoutMatch;