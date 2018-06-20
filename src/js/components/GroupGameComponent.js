import React from 'react';
import PropTypes from 'prop-types';
import dateFormater from '../helpers/dateFormater';

export const GroupGameComponent = (props) => {
  const predictClass = props.data.confirmed ? '' : 'predict';
  const stadium = props.data.stadium ? props.data.stadium.name : '';

  return (
    <div className="group-match-container">
      <div>
        <div className="group-date">{dateFormater(props.data.date)}</div>
        <div className={'group-teams ' + predictClass}>
          <div className="group-team">
            <div className="group-country-name">{props.data.team1.name}</div>
            <div className="group-scorers">{props.homeScorers}</div>
          </div>
          { props.scoreOrPrediction }
          <div className="group-team">
            <div className="group-country-name">{props.data.team2.name}</div>
            <div className="group-scorers">{props.awayScorers}</div>
          </div>
        </div>
      </div>
      <div>
        <div className="group-stadium">{ stadium }</div>
        <div className="group-location">{props.data.city}</div>
        <hr className="group-line" />
      </div>
    </div>
  );
};

GroupGameComponent.propTypes = {
  data: PropTypes.object.isRequired,
  homeScorers: PropTypes.array.isRequired,
  awayScorers: PropTypes.array.isRequired,
  scoreOrPrediction: PropTypes.object.isRequired,
};
