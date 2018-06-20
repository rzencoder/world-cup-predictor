import React from 'react';
import PropTypes from 'prop-types';
import FlagIcon from '../components/FlagIcon';
import codeConverter from '../data/flagCodes';

const GroupTableComponent = (props) => {
  const teams = props.teams.map(el => (
    <tr key={el.name}>
      <td><FlagIcon code={codeConverter(el.code)} size="2x" /></td>
      <td>{el.name}</td>
      <td>{el.won}</td>
      <td>{el.drawn}</td>
      <td>{el.lost}</td>
      <td>{el.gd}</td>
      <td>{el.pts}</td>
    </tr>
  ));

  return (
    <div>
      <h2 className="group-title">{props.name}</h2>
      <table className="group-table">
        <thead>
          <tr>
            <th />
            <th>Team</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          { teams }
        </tbody>
      </table>
    </div>
  );
};

GroupTableComponent.propTypes = {
  teams: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
};

export default GroupTableComponent;
