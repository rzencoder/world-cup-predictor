import React, { Component } from 'react';

import HoverInfo from '../components/HoverInfo.js';
import FlagIcon from '../components/FlagIcon.js';
import codeConverter from '../data/flagCodes.js';
import dateFormater from '../helpers/dateFormater.js';

class KnockoutGameComponent extends Component {

    calculateScore (data, i) {
        //Check if match went to extra time else return score
        if (data['score' + i + 'et'] !== null) {
            //Display 'AET' to only one team
            const extra = i === 1 ? 'AET ' : '';
            if (data.score1et !== data.score2et) {
                return extra + data['score' + i + 'et'];
            } else {
                // If scores at extra time were level match went to pens anf original score from api is penalty score
                return extra + data['score' + i + 'et'] + ' (' + data['score' + i] + ')';
            }
        }
        return data['score' + i];
    }

    renderHomePrediction () {
        return (
            <div id="home" className="knockout-prediction">
                <div onClick={this.props.changeScoreClick} className="down">-</div>
                <div>
                <input name="homeScore"
                    type="number"
                    ref={this.props.score1Input}
                    value={this.props.homeScore}
                    onChange={this.props.handleInputChange} 
                    min="0"/>
                </div>
                <div onClick={this.props.changeScoreClick} className="up">+</div>
            </div>
        );
    }

    renderAwayPrediction () {
        return (
            <div id="away" className="knockout-prediction">
                <div onClick={this.props.changeScoreClick} className="down">-</div>
                <div>
                    <input name="awayScore"
                        type="number"
                        ref={this.props.score2Input}
                        value={this.props.awayScore}
                        onChange={this.props.handleInputChange} 
                        min="0"/>
                </div>
                <div onClick={this.props.changeScoreClick} className="up">+</div>
            </div>
        );
    }

    renderHomeGoalscorers (side) {
        return this.props.data.goals1.map((el, i) => {
            return <div key={i}><i className="fas fa-futbol"></i> '{el.minute} {el.name}</div>
        });
    }

    renderAwayGoalscorers (side) {
        return this.props.data.goals2.map((el, i) => {
            return <div key={i}><i className="fas fa-futbol"></i> '{el.minute} {el.name}</div>
        });
    }

    render () {
        const homeScorers = this.props.data.goals1 ? this.renderHomeGoalscorers() : '';
        const awayScorers = this.props.data.goals2 ? this.renderAwayGoalscorers() : '';
        const homeHover = this.props.data.goals1 ? <HoverInfo data={homeScorers} /> : '';
        const awayHover = this.props.data.goals2 ? <HoverInfo data={awayScorers} /> : '';

        const homeTeam = this.props.data.team1.name !== null ? this.props.data.team1.name : this.props.data.team1.position;
        const awayTeam = this.props.data.team2.name !== null ? this.props.data.team2.name : this.props.data.team2.position;
        const homeFlag = this.props.data.team1.name === null ? "" : <FlagIcon code={codeConverter(this.props.data.team1.code)} size={'2x'} />;
        const awayFlag = this.props.data.team2.name === null ? "" : <FlagIcon code={codeConverter(this.props.data.team2.code)} size={'2x'} />;
        const stadium = this.props.data.stadium ? this.props.data.stadium.name : '';

        //Checking if result has actually been played and display score else display prediction
        const homeScore = this.props.data.score1 === null && this.props.data.team1.name !== null 
                            && this.props.data.team2.name !== null ? 
                            this.renderHomePrediction() : <span>{this.calculateScore(this.props.data, 1)}</span>;

        const awayScore = this.props.data.score2 === null && this.props.data.team1.name !== null 
                            && this.props.data.team2.name !== null ? 
                            this.renderAwayPrediction() : <span>{this.calculateScore(this.props.data, 2)}</span>; 

        console.log(this.props.data)
        return (
            <div>
                <div className="knockout-date">{dateFormater(this.props.data.date)}</div>
                <div className="knockout-teams">
                    <div className="knockout-team">
                        <div>
                            { homeFlag }
                        <div className="knockout-country-name">
                            <div>
                                { homeTeam }
                            </div>
                            { homeHover }
                        </div>   
                        <div className="knockout-score">
                            { homeScore }
                        </div>
                        </div>
                        <div className="knockout-scorers">
                            { homeScorers }
                        </div>     
                    </div>
                    
                    <div className="knockout-team">
                        <div>
                            { awayFlag }
                        <div className="knockout-country-name">
                            { awayTeam }
                        </div>
                        { awayHover }
                        <div className="knockout-score">
                            { awayScore }
                        </div>
                        </div>
                        <div className="knockout-scorers">
                            { awayScorers }
                        </div>        
                    </div>
                </div>
                <div className="knockout-stadium">{ stadium }</div>
                <div className="knockout-location">{this.props.data.city}</div>
            </div>
        );
    }
}

export default KnockoutGameComponent;