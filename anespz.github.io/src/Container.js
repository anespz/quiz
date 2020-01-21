import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import QuestionCard from './Cards/QuestionCard.js';
import './App.css';
import { Route } from 'react-router-dom'
import MenuCard from './Cards/MenuCard.js';
import ResultsCard from './Cards/ResultsCard.js';

class Container extends Component {

    constructor(props) {
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Added to avoid CORS during development.
        var fullUrl = proxyUrl + 'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json';
        super(props);
        this.state = {
            jsonUrl: { fullUrl },
            jsonObj: null
        };
    }

    /**
     * Instantiate the QuestionCard with data from the database.
     */
    fetchJSON() {
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Added to avoid CORS during development.
        fetch('http://localhost:3000/payload')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .then(response => response.json())
            .then(doc => {
                console.log('found qu!');
                this.setState({
                    jsonObj: doc,
                }, () => {
                    console.log('state set!!!');
                    console.log('' + this.state.jsonObj.activities[0].questions[0].stimulus);
                });
            })
            .catch(error => console.log('Error:', error));
    }

    getActivityObj(name) {
        console.log(this.state.jsonObj);  
        let o = this.state.jsonObj;
        for (let i = 0; i < o.activities.length; i++) {
            let act = o.activities[i];
            if (act.activity_name === name) {
                console.log('return act')
                console.log(act);
                return act;
            }
        }
    }

    getRoundObj(name, round) {
        console.log('getting round')
        let act = this.getActivityObj(name);
        for (let i = 0; i < act.questions.length; i++) {
            let r = act.questions[i];
            if (r.order === round) {
                console.log('return round');
                console.log(r);
                return r;
            }
        }
    }

    getQuestionObj(name, round, order) {
        let obj = null;
        if (name === 'Activity Two') {
            obj = this.getRoundObj(name, round)
        }
        else {
            obj = this.getActivityObj(name);
        }
        for (let j = 0; j < obj.questions.length; j++) {
            let qu = obj.questions[j];
            if (qu.order === order) {
                return qu;
            }
        }
    }


    render() {
        return (
            <div className="App">
                <Route exact path='/activityone'>
                    {/* <QuestionCard activity='Activity One' question={1} jsonObj={this.state.jsonObj} updateJSON={this.fetchJSON} /> */}
                    <QuestionCard activity='Activity One'
                        question={1}
                        getQuestionObj={this.getQuestionObj.bind(this)}
                        getActivityObj={this.getActivityObj.bind(this)}
                        jsonObj={this.state.jsonObj}
                        updateJSON={this.fetchJSON} />
                </Route>
                <Route exact path='/activitytwo'>
                    <QuestionCard activity='Activity Two'
                        round={1} question={1}
                        getQuestionObj={this.getQuestionObj.bind(this)}
                        getActivityObj={this.getActivityObj.bind(this)}
                        jsonObj={this.state.jsonObj}
                        updateJSON={this.fetchJSON} />
                </Route>
                <Route exact path='/menu'>
                    <MenuCard />
                </Route>
                <Route exact path='/activityone/results'>
                    <ResultsCard activity='Activity One' 
                    getQuestionObj={this.getQuestionObj.bind(this)}
                    getRoundObj={this.getRoundObj.bind(this)} 
                    getActivityObj={this.getActivityObj.bind(this)}
                    jsonObj={this.state.jsonObj} />
                </Route>
                <Route exact path='/activitytwo/results'>
                    <ResultsCard activity='Activity Two' 
                    getQuestionObj={this.getQuestionObj.bind(this)}
                    getRoundObj={this.getRoundObj.bind(this)} 
                    getActivityObj={this.getActivityObj.bind(this)}
                    jsonObj={this.state.jsonObj} />
                </Route>
            </div>
        );
    }


    componentDidMount() {
        console.log('mounting container')
        this.fetchJSON();
        console.log('mount done')
    }


}

export default withRouter(Container);
