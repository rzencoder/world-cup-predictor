import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../flagCodes.js';

class GroupGames extends Component {
  render() {
    console.log(this.props.data)
      return (
      <div>    
        <div>{this.props.data.date}</div>
        <div>
          <div>{this.props.data.team1.name}</div>
          <div>{this.props.data.team2.name}</div>
        </div>
        <div>{this.props.data.stadium.name + ', ' + this.props.data.city}</div>
      </div>
    );
  }
}

export default GroupGames;