import React from 'react';
import PropTypes from 'prop-types';

const HoverInfo = props => (
  <div className="hover-info-container">
    <div>
      {props.data}
    </div>
  </div>
);

HoverInfo.propTypes = {
  data: PropTypes.array.isRequired,
};

export default HoverInfo;
