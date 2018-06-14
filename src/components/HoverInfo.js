import React from 'react';

const HoverInfo = props => {
    return (
        <div className="hover-info-container"> 
            <div>
                {props.data}
            </div>
        </div>
    );
}

export default HoverInfo;