import React, { Component } from 'react';
import KnockoutMatch from './KnockoutMatch.js';

class Knockout extends Component {
    render() {
    console.log(this.props.data);
    const roundMatches = this.props.data.matches.map((el, i) => {
        return <KnockoutMatch key={i} data={el}/>
    })
      return (
        <div>
            <h2>{this.props.data.name}</h2> 
            <div className="knockout-round-container">    
                {roundMatches}
            </div>
        </div>
    );
  }
}

export default Knockout;