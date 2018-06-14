import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../flagCodes.js';
import HoverInfo from './HoverInfo.js';
import dateFormater from '../dateFormater.js';

class KnockoutMatch extends Component {

    render() {
    
      let awayScorers = [];
      let homeScorers = [];

      if (this.props.data.goals1) {
        homeScorers = this.props.data.goals1.map((el, i) => {
          return <div key={i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
        });
        awayScorers = this.props.data.goals2.map((el, i) => {
          return <div key={i}><i className="fa fa-soccer-ball-o"></i> '{el.minute} {el.name}</div>
        });
      }

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
                {this.props.data.score1 === null ? '' : <span>{this.props.data.score1}</span>}
                {this.props.data.score1et === null ? '' : <span>{this.props.data.score1et}</span>}
              </div>
            </div>
            <div className="knockout-scorers">
              {homeScorers}
            </div>     
          </div>
          
          <div className="knockout-team">
            <div>
              <FlagIcon code={codeConverter(this.props.data.team2.code)} size={'2x'} />
              <div className="knockout-country-name">{this.props.data.team2.name}</div>
              {awayScorers.length ? <HoverInfo data={awayScorers}/> : ''}
              <div className="knockout-score">
                {this.props.data.score2 === null ? '' : <span>{this.props.data.score2}</span>}
                {this.props.data.score2et === null ? '' : <span>{this.props.data.score2et}</span>}
              </div>
             </div>
             <div className="knockout-scorers">
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