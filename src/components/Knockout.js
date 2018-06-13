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

class Knockout extends Component {
  render() {
      return (
      <div className="knockout-match-container">    

      </div>
    );
  }
}

export default Knockout;