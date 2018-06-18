import React, { Component } from 'react';
import { connect } from "react-redux";
import FlagIcon from './FlagIcon.js';
import codeConverter from '../js/flagCodes.js';
import { itemsFetchData, updateQualifier } from '../actions/index';
import {advance} from '../js/matchData';

const mapStateToProps = (state) => {
  return {
    items: state.items,
    knockouts: state.knockouts
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateQualifier: (teams, index1, index2, round) => dispatch(updateQualifier(teams, index1, index2, round)),
    
  };
};

class GroupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      qualified: []
    };

    this.calculateTable = this.calculateTable.bind(this)
  }

  componentDidUpdate(prevProps) {
      // Typical usage (don't forget to compare props):
      if (this.props.data !== prevProps.data) {
        this.calculateTable();
      }
    }

  calculateTable () {
    let teams = [];
    const group = this.props.data;
    group.matches.map(el => [el.team1.name, el.team1.code])
      .map(el => {
        return {
          name: el[0],
          code: el[1],
          won: 0,
          drawn: 0,
          lost: 0,
          gd: 0,
          pts: 0
        };
      }).filter(el => {
        const i = teams.findIndex(x => x.name === el.name);
        if (i <= -1) teams.push(el);
        return null;
      });
    
    group.matches.forEach(match => {
      
      let homeTeam;
      let awayTeam;
      teams.forEach(team => {
        if (team.name === match.team1.name) homeTeam = team;
        if (team.name === match.team2.name) awayTeam = team;
      });
      const result = match.score1 - match.score2;

      if(match.score1 === null) {}
      else if (result > 0) {
        homeTeam.won += 1;
        homeTeam.gd += result;
        homeTeam.pts += 3;
        awayTeam.lost += 1;
        awayTeam.gd -= result;
      } else if (result < 0) {
          awayTeam.won += 1;
          awayTeam.gd -= result;
          awayTeam.pts += 3;
          homeTeam.lost += 1;
          homeTeam.gd += result;
      } else if (result === 0) {
        homeTeam.drawn += 1;
        homeTeam.pts += 1;
        awayTeam.drawn += 1;
        awayTeam.pts += 1;
      }

    });
    const sortedTeams = teams.sort((a, b) => a.gd < b.gd)
      .sort((a, b) => a.pts < b.pts);

    let firstPlace;
    let secondPlace;
    let a = advance[0].matches.filter(el => {
      if (el.team1 === this.props.index) firstPlace = el.num;
      if (el.team2 === this.props.index) secondPlace = el.num;
      return null;
    });

    let firstIndex;
    let secondIndex;

    this.props.knockouts[0]['matches'].filter((el, i)=> {
      if(this.props.first === el.num) firstIndex = i;
      if (this.props.second === el.num) secondIndex = i;
    })

    const qualified =  [ 
        { num: 49, name: sortedTeams[0]['name'], code: sortedTeams[0]['code'] },
        { num: 49, name: sortedTeams[1]['name'], code: sortedTeams[1]['code'] }
      ];

    this.props.updateQualifier(qualified, firstIndex, secondIndex, 0)

   this.setState({ 
     teams: sortedTeams
  });
  }

  componentWillMount () {
    this.calculateTable();
  }

  render() {
    const teams = this.state.teams.map((el, i) => {
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
        <h2 className="group-title">{this.props.name}</h2>
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
            {teams}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupTable);