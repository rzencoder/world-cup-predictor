import React, { Component } from 'react';
import FlagIcon from './FlagIcon.js';
import codeConverter from '../flagCodes.js';

class GroupTable extends Component {
  render() {
    const teams = this.props.data.standings.map((el, i) => {
      return (
        <tr key={i}>
          <td><FlagIcon code={codeConverter(el.team.code)} size={'2x'} /></td>
          <td>{el.team.name}</td>
          <td>{el.won}</td>
          <td>{el.drawn}</td>
          <td>{el.lost}</td>
          <td>{el.goals_for - el.goals_against}</td>
          <td>{el.pts}</td>
        </tr>
      )
    });
    return (
      <div>
        <h2 className="group-title">{this.props.data.name}</h2>
        <table>
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
            {teams}
          </tbody>
        </table>
      </div>
    );
  }
}

export default GroupTable;