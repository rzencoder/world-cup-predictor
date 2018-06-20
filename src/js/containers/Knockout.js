import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Champions from '../components/Champions';

const mapStateToProps = state => ({
  champions: state.champions,
});

// Display which knockout round in the heading
const roundConverter = (length) => {
  let name;
  const rounds = [{ name: 'Last 16', length: 8 }, { name: 'Quarter Finals', length: 4 }, { name: 'Semi Finals', length: 2 }, { name: 'Final', length: 1 }];
  rounds.forEach((round) => {
    if (round.length === length) name = round.name;
  });
  return name;
};

const Knockout = (props) => {
  // Display champions component if the current round is the final and a winner has been predicted
  const displayChampions = (
    props.champions.name !== null && props.round === 3 ?
      <Champions team={props.champions} /> : ''
  );
  return (
    <div className="knockout-stage">
      <h2>{roundConverter(props.data.length)}</h2>
      <div className={'knockout-round-container bracket-' + (props.round + 1)}>
        {displayChampions}
        {props.data}
      </div>
    </div>
  );
};

Knockout.propTypes = {
  data: PropTypes.array.isRequired,
  round: PropTypes.number.isRequired,
  champions: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, null)(Knockout);
