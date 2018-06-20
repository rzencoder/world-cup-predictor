import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  const infoPanel = (
    <div className="info-panel">
      <i onClick={props.closeInfo} role="button" tabIndex={0} className="fas fa-times" />
      <p>API updated daily <a href="https://github.com/openfootball/world-cup.json">https://github.com/openfootball/world-cup.json</a></p>
      <p>All Kickoff Times (UTC +00:00)</p>
    </div>
  );

  const showInfo = props.showInfo ? infoPanel : '';

  return (
    <div>
      <a href="https://github.com/rzencoder/world-cup-predictor" className="github-link"><i className="fab fa-github" /></a>
      <h1 className="title">World Cup 2018 Russia</h1>
      { showInfo }
      <div className="container">
        <div className="round-selector">
          <div
            id="groupToggle"
            role="button"
            tabIndex={0}
            className={props.knockout ? '' : 'toggle'}
            onClick={props.toggleRound}
          >Groups
          </div>
          <div
            id="knockoutToggle"
            role="button"
            tabIndex={0}
            className={props.knockout ? 'toggle' : ''}
            onClick={props.toggleRound}
          >Knockouts
          </div>
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  knockout: PropTypes.bool.isRequired,
  closeInfo: PropTypes.func.isRequired,
  showInfo: PropTypes.bool.isRequired,
  toggleRound: PropTypes.func.isRequired,
};

export default Header;
