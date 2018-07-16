import React from 'react';
import PropTypes from 'prop-types';

const Header = (props) => {
  const infoPanel = (
    <div className="info-panel">
      <i
        onClick={props.closeInfo}
        onKeyDown={props.keyDownCloseInfo}
        role="button"
        tabIndex={0}
        className="fas fa-times"
      />
      <p>API <a href="https://github.com/openfootball/world-cup.json">https://github.com/openfootball/world-cup.json</a></p>
      <p>All Kickoff Times (UTC +00:00)</p>
    </div>
  );

  const showInfo = props.showInfo ? infoPanel : '';

  return (
    <div>
      <a href="https://github.com/rzencoder/world-cup-predictor" className="github-link"><i className="fab fa-github" /></a>
      <h1 className="title">World Cup {props.year}</h1>
      { showInfo }
      <div className="container">
        <form className="year-selector" onSubmit={props.handleYearSubmit}>
          <label htmlFor="year">
            Select Year
            <select name="year" value={props.year} onChange={props.handleYearChange}>
              <option value="2018 Predictor">2018 Predictor</option>
              <option value="2018 Results">2018 Results</option>
              <option value="2014 Results">2014 Results</option>
            </select>
          </label>
          <input className="btn-submit" type="submit" value="Submit" />
        </form>
        <div className="round-selector">
          <div
            id="groupToggle"
            role="button"
            tabIndex={0}
            className={props.knockout ? '' : 'toggle'}
            onClick={props.toggleRound}
            onKeyDown={props.keyDownToggle}
          >Groups
          </div>
          <div
            id="knockoutToggle"
            role="button"
            tabIndex={0}
            className={props.knockout ? 'toggle' : ''}
            onClick={props.toggleRound}
            onKeyDown={props.keyDownToggle}
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
  keyDownToggle: PropTypes.func.isRequired,
  keyDownCloseInfo: PropTypes.func.isRequired,
  handleYearChange: PropTypes.func.isRequired,
  handleYearSubmit: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired,
};

export default Header;
