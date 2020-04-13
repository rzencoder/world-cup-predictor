import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { updateQualifier, removeTeam, removeChampions } from "../actions/index";
import GroupTableComponent from "../components/GroupTableComponent";

const mapStateToProps = (state) => ({
  groups: state.groups,
  knockouts: state.knockouts,
  champions: state.champions,
});

const mapDispatchToProps = (dispatch) => ({
  updateQualifier: (teams, index1, index2, round) =>
    dispatch(updateQualifier(teams, index1, index2, round)),
  removeTeam: (round, match, home) => dispatch(removeTeam(round, match, home)),
  removeChampions: (team) => dispatch(removeChampions(team)),
});

class GroupTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
    };

    this.calculateTable = this.calculateTable.bind(this);
  }

  componentDidMount() {
    this.initializeTable();
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      this.initializeTable();
    }
  }

  initializeTable() {
    const teams = [];
    const group = this.props.data;
    // Mapping each team with table data then filtering out any duplicate 2 teams
    group.matches
      .map((el) => [el.team1.name, el.team1.code])
      .map((el) => ({
        name: el[0],
        code: el[1],
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0,
      }))
      .filter((el) => {
        const i = teams.findIndex((x) => x.name === el.name);
        if (i <= -1) teams.push(el);
        return null;
      });

    this.setState(
      {
        teams,
      },
      () => this.calculateTable()
    );
  }

  calculateTable() {
    const group = this.props.data;
    const teams = [...this.state.teams];

    // Filter through matches extract results and update table stats
    group.matches.forEach((match) => {
      let homeTeam;
      let awayTeam;
      teams.forEach((team) => {
        if (team.name === match.team1.name) homeTeam = team;
        if (team.name === match.team2.name) awayTeam = team;
      });
      const result = match.score1 - match.score2;
      homeTeam.gf = match.score1;
      homeTeam.ga = match.score2;
      awayTeam.gf = match.score2;
      awayTeam.ga = match.score1;

      // Logic for updating table stats
      if (match.score1 === null) {
        return null;
      } else if (result > 0) {
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
      return null;
    });

    /* Sort table by points and goal difference and goals scored.
    Don't chain as causes bug in Microsoft Edge */
    const sortedTeams = teams.sort((a, b) => (a.gf < b.gf ? 1 : -1));
    sortedTeams.sort((a, b) => (a.gd < b.gd ? 1 : -1));
    sortedTeams.sort((a, b) => (a.pts < b.pts ? 1 : -1));

    this.setState(
      {
        teams: sortedTeams,
      },
      () => this.calculateQualifiers()
    );
  }

  checkFutureGames() {
    /* Remove all teams from knockouts after changing group to prevent bugs where
    teams not qualified from the group are still in the knockouts */
    const teams = [...this.state.teams];
    // Slice to just get last 16 round
    const knockouts = [...this.props.knockouts].slice(1);
    const removeTeamArr = [];
    teams.forEach((team) => {
      knockouts.forEach((round, i) => {
        round.matches.forEach((match, j) => {
          if (team.name === match.team1.name) {
            removeTeamArr.push({
              name: team.name,
              round: i + 1,
              match: j,
              home: "team1",
            });
          }
          if (team.name === match.team2.name) {
            removeTeamArr.push({
              name: team.name,
              round: i + 1,
              match: j,
              home: "team2",
            });
          }
        });
      });
    });

    // Removing teams from the knockout founds if result only predicted
    if (removeTeamArr.length) {
      removeTeamArr.forEach((el) => {
        if (!this.props.knockouts[el.round].matches[el.match].confirmed) {
          this.props.removeTeam(el.round, el.match, el.home);
        }
        if (el.name === this.props.champions.name) {
          this.props.removeChampions(this.props.champions);
        }
      });
    }
  }

  calculateQualifiers(prevTable) {
    const { teams } = this.state;
    let firstIndex;
    let secondIndex;

    // Get the match that the qualifiers will play next
    this.props.knockouts[0].matches.filter((el, i) => {
      if (this.props.first === el.num) firstIndex = i;
      if (this.props.second === el.num) secondIndex = i;
      return null;
    });

    const qualified = [
      { name: teams[0].name, code: teams[0].code },
      { name: teams[1].name, code: teams[1].code },
    ];

    this.props.updateQualifier(qualified, firstIndex, secondIndex, 0);
    this.checkFutureGames(prevTable);
  }

  render() {
    return (
      <div>
        <GroupTableComponent teams={this.state.teams} name={this.props.name} />
      </div>
    );
  }
}

GroupTable.propTypes = {
  knockouts: PropTypes.array.isRequired,
  first: PropTypes.number.isRequired,
  second: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  updateQualifier: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  removeTeam: PropTypes.func.isRequired,
  champions: PropTypes.object.isRequired,
  removeChampions: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupTable);
