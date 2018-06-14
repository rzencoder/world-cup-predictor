import React, { Component } from 'react';
import KnockoutMatch from './KnockoutMatch.js';

class Knockout extends Component {
    render() {
    
      return (
        <div className="knockout-stage">
            <h2>{this.props.data.i}</h2> 
            <div className="knockout-round-container">    
                {this.props.data}
            </div>
        </div>
    );
  }
}

export default Knockout;