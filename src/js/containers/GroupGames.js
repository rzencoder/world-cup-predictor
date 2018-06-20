import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { GroupGameComponent } from '../components/GroupGameComponent';
import { updateScore } from '../actions/index';

const mapStateToProps = state => ({
  groups: state.groups,
});

const mapDispatchToProps = dispatch => ({
  updateScore: (group, index, score, home) => dispatch(updateScore(group, index, score, home)),
});

class GroupGames extends Component {
  constructor(props) {
    super(props);
    this.state = {
      homeScore: '',
      awayScore: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.score1Input = React.createRef();
    this.score2Input = React.createRef();
  }

  handleInputChange(e) {
    const name = e.target.name;
    const home = name === 'homeScore' ? 1 : 2;
    this.updateScore(name, e.target.value, home);
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      this.changeScore(e);
    }
  }

  handleClick(e) {
    this.changeScore(e);
  }

  updateScore(name, value, home) {
    this.setState({
      [name]: value,
    }, () => this.updateTable(value, home));
  }

  updateTable(value, home) {
    this.props.updateScore(this.props.group, this.props.index, value, home);
  }

  changeScore(e) {
    // Check if user increased or decreased score
    const incOrDec = e.target.className;
    // Check using refs is the home or away team was clicked
    const id = e.currentTarget.parentNode.id;
    const ref = id === 'home' ? this.score1Input.current.value : this.score2Input.current.value;
    // If value was empty convert to 0
    const input = ref === '' ? 0 : ref;
    // Add or remove 1 and prevent negative number;
    let value = incOrDec === 'up' ? parseInt(input, 10) + 1 : parseInt(input, 10) - 1;
    value = value < 0 ? 0 : value;
    const name = id + 'Score';
    const home = id === 'home' ? 1 : 2;
    this.updateScore(name, value, home);
  }

  render() {
    const data = this.props.data;
    // If goals scored display list of scorers
    let homeScorers = [];
    let awayScorers = [];
    if (data.goals1 || data.goals2) {
      homeScorers = data.goals1.map(el => (
        <div key={el.minute + el.name}>
          <i className="fas fa-futbol" /> &#39;{el.minute} {el.name}
        </div>));
      awayScorers = data.goals2.map(el => (
        <div key={el.minute + el.name}>
          <i className="fas fa-futbol" /> &#39;{el.minute} {el.name}
        </div>));
    }

    const prediction = (
      <div className="prediction-container">
        <div id="home">
          <div
            role="button"
            tabIndex={0}
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            className="up"
          />
          <div>
            <input
              name="homeScore"
              type="number"
              ref={this.score1Input}
              value={this.state.homeScore}
              onChange={this.handleInputChange}
              min="0"
            />
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            className="down"
          />
        </div>
        <div id="away">
          <div
            role="button"
            tabIndex={0}
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            className="up"
          />
          <div>
            <input
              name="awayScore"
              type="number"
              ref={this.score2Input}
              value={this.state.awayScore}
              onChange={this.handleInputChange}
              min="0"
            />
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={this.handleClick}
            onKeyDown={this.handleKeyDown}
            className="down"
          />
        </div>
      </div>
    );

    const score = <span className="group-time">{data.score1} : {data.score2}</span>;
    const scoreOrPrediction = data.confirmed ? score : prediction;

    return (
      <div>
        <GroupGameComponent
          data={data}
          scoreOrPrediction={scoreOrPrediction}
          homeScorers={homeScorers}
          awayScorers={awayScorers}
        />
      </div>
    );
  }
}

GroupGames.propTypes = {
  data: PropTypes.object.isRequired,
  updateScore: PropTypes.func.isRequired,
  group: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,

};

export default connect(mapStateToProps, mapDispatchToProps)(GroupGames);
