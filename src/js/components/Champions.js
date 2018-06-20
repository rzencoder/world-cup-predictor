import React from 'react';
import PropTypes from 'prop-types';
import sizeMe from 'react-sizeme';
import Confetti from 'react-confetti';

import FlagIcon from './FlagIcon';
import codeConverter from '../data/flagCodes';

const Champions = props => (
  <div className="champions-container">
    <div className="champions-data">
      <Confetti {...props.size} numberOfPieces={50} />
      <div><i className="fas fa-trophy" /></div>
      <div className="champions-flag">
        <FlagIcon code={codeConverter(props.team.code)} size="2x" />
      </div>
      <div className="champions-team">{props.team.name}</div>
    </div>
  </div>
);

Champions.propTypes = {
  size: PropTypes.object.isRequired,
  team: PropTypes.object.isRequired,
};

export default sizeMe({ monitorWidth: true, monitorHeight: true })(Champions);
