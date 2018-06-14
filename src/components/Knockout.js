import React, { Component } from 'react';

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