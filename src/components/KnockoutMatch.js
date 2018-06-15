import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../js/flagCodes.js';
import HoverInfo from './HoverInfo.js';
import dateFormater from '../js/dateFormater.js';

class KnockoutMatch extends Component {

    render() {
      console.log(this.props.data)
      //Render Goalscorer list
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

      return (
      < div className = "knockout-match bracket-team" >
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
                {this.props.data.score1 === null ? '' : <span>{calculateScore(this.props.data, 1)}</span>}
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
                {this.props.data.score1 === null ? '' : <span>{calculateScore(this.props.data, 2)}</span>}
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

export default KnockoutMatch;