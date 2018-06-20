import React from 'react';

const Header = props => {
    const infoPanel = (
      <div className="info-panel">
        <i onClick={props.closeInfo} className="fas fa-times"></i>
        <p>API updated daily <a href="https://github.com/openfootball/world-cup.json">https://github.com/openfootball/world-cup.json</a></p>
        <p>All Kickoff Times (UTC +00:00)</p>
      </div>
    );

    const showInfo = props.showInfo ? infoPanel : '';

    return (
        <div>
            <a href="https://github.com/rzencoder/world-cup-predictor" className="github-link"><i className="fab fa-github"></i></a>
            <h1 className="title">World Cup 2018 Russia</h1>
            { showInfo } 
            <div className="container">      
                <div className="round-selector">
                    <div id="groupToggle" className={props.knockout ? '' : "toggle" } onClick={props.toggleRound}>Groups</div>
                    <div id="knockoutToggle" className={props.knockout ? "toggle" : '' } onClick={props.toggleRound}>Knockouts</div>
                </div>
            </div>
        </div>
    );
}

export default Header;