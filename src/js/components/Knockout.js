import React, { Component } from 'react';

//Display which knockout round in the heading
const roundConverter = len => {
    let name;
    const rounds = [{ name: "Last 16", length: 8 }, { name: "Quarter Finals", length: 4 }, { name: "Semi Finals", length: 2 }, { name: "Final", length: 1 }];
    rounds.forEach(round => {
        if (round.length === len) name = round.name;
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
                </div>
            </div>
        );
    }
}

export default Knockout;