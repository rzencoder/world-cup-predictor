import React, { Component } from 'react';
import { connect } from "react-redux";
import FlagIcon from './FlagIcon.js';
import codeConverter from '../data/flagCodes.js';
import { updateQualifier } from '../actions/index';

const mapStateToProps = state => {
  return {
    groups: state.groups,
    knockouts: state.knockouts
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateQualifier: (teams, index1, index2, round) => dispatch(updateQualifier(teams, index1, index2, round)),
    
  };
};

class GroupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: []
    };

    this.calculateTable = this.calculateTable.bind(this)
  }

  componentDidMount () {
    this.initializeTable();
  }

  componentDidUpdate (prevProps) {
    if (this.props.data !== prevProps.data) {
      this.initializeTable();
    }
  }

  initializeTable () {
    let teams = [];
    const group = this.props.data;
    //Mapping each team with table data then filtering out any duplicate 2 teams
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
      
      this.setState({
        teams: teams
      }, () => this.calculateTable())
  }

  calculateTable () {
    const group = this.props.data;
    const teams = this.state.teams;
    //Filter through matches extract results and update table stats
    group.matches.forEach(match => {   
      let homeTeam;
      let awayTeam;
      teams.forEach(team => {
        if (team.name === match.team1.name) homeTeam = team;
        if (team.name === match.team2.name) awayTeam = team;
      });
      const result = match.score1 - match.score2;
      //Logic for updating table stats
      if (match.score1 === null) {}
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

    //Sort table by points and goal difference
    const sortedTeams = teams.sort((a, b) => a.gd < b.gd)
      .sort((a, b) => a.pts < b.pts);

    this.setState({
      teams: sortedTeams
    }, () => this.calculateQualifiers());

  }

  calculateQualifiers () {
    const { teams } = this.state;
    let firstIndex;
    let secondIndex;

    //Get the match that the qualifiers will play next
    this.props.knockouts[0]['matches'].filter((el, i)=> {
      if (this.props.first === el.num) firstIndex = i;
      if (this.props.second === el.num) secondIndex = i;
      return null;
    })

    const qualified =  [ 
        { num: 49, name: teams[0]['name'], code: teams[0]['code'] },
        { num: 49, name: teams[1]['name'], code: teams[1]['code'] }
      ];

    this.props.updateQualifier(qualified, firstIndex, secondIndex, 0)

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