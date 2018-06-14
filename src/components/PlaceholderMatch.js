import React, { Component } from 'react';

class PlaceholderMatch extends Component {
    render() {
      return (
      <div className="knockout-match"> 
       <div className="knockout-date">{this.props.data.date}</div>
        <div className="knockout-teams">
          <div className="knockout-team">
            <div>
              <div className="knockout-country-name placeholder-name">
                <div>{this.props.data.team1}</div>
              </div>
            </div> 
          </div>
          
          <div className="knockout-team">
            <div>
              <div className="knockout-country-name placeholder-name">{this.props.data.team2}</div>
             </div> 
          </div>
        </div>
        <div className="knockout-match-stadium">{this.props.data.stadium}</div>
        <div className="knockout-match-location">{this.props.data.location}</div>
      </div>
    );
  }
}

export default PlaceholderMatch;