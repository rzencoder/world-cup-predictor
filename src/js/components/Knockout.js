import React, { Component } from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import Champions from './Champions.js';

const mapStateToProps = state => {
    return {
        champions: state.champions
    };
};

//Display which knockout round in the heading
const roundConverter = length => {
    let name;
    const rounds = [{ name: "Last 16", length: 8 }, { name: "Quarter Finals", length: 4 }, { name: "Semi Finals", length: 2 }, { name: "Final", length: 1 }];
    rounds.forEach(round => {
        if (round.length === length) name = round.name;
    });
    return name;
};

class Knockout extends Component {
    render() {
        return (          
            <div className="knockout-stage">
                <h2>{roundConverter(this.props.data.length)}</h2> 
                <div className={"knockout-round-container bracket-" + (this.props.round + 1)}>    
                    {this.props.data}
                    {this.props.champions.name !== null && this.props.round === 3 ? <Champions team={this.props.champions}/> : ''}
                </div>
            </div>
        );
    }
}

Knockout.propTypes = {
    data: PropTypes.array.isRequired,
    round: PropTypes.number.isRequired,
    champions: PropTypes.object.isRequired
};

export default connect(mapStateToProps, null)(Knockout);