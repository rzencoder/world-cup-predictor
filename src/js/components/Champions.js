import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../data/flagCodes.js';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

class Champions extends Component {
    render () { 
        return (
            <div className="champions-container"> 
                <div className="champions-data">
                    <Confetti {...this.props.size} numberOfPieces={50} />
                    <div><i className="fas fa-trophy"></i></div>
                    <div className="champions-flag"><FlagIcon code={codeConverter(this.props.team.code)} size={'2x'} /></div>
                    <div className="champions-team">{this.props.team.name}</div>
                </div>
            </div>
        );
    }
}

export default sizeMe({ monitorWidth: true, monitorHeight: true })(Champions)