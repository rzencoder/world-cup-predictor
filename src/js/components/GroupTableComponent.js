import React from 'react';
import FlagIcon from '../components/FlagIcon.js';
import codeConverter from '../data/flagCodes.js';

const GroupTableComponent = props => {
    const teams = props.teams.map((el, i) => {
      return (
        <tr key={i}>
          <td><FlagIcon code={codeConverter(el.code)} size={'2x'} /></td>
          <td>{el.name}</td>
          <td>{el.won}</td>
          <td>{el.drawn}</td>
          <td>{el.lost}</td>
          <td>{el.gd}</td>
          <td>{el.pts}</td>
        </tr>
      )
    });

    return (
        <div>
        <h2 className="group-title">{props.name}</h2>
        <table className="group-table">
          <thead>
            <tr>
              <th></th>
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
}

export default GroupTableComponent;