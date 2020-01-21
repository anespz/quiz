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
                    return this.state.jsonObj;
                });
            })
            .catch(error => console.log('Error:', error));
    }

    getActivity(name) {
        console.log(this.state.jsonObj);
        let o = this.state.jsonObj;
        for (let i = 0; i < o.activities.length; i++) {
            let act = o.activities[i];
            if (act.activity_name === name) {
                return act;
            }
        }
    }


    render() {
        return (
            <div className="App">
                <Route exact path='/activityone'>
                    {/* <QuestionCard activity='Activity One' question={1} jsonObj={this.state.jsonObj} updateJSON={this.fetchJSON} /> */}
                    <QuestionCard activity='Activity One' question={1} getActivityJSON={this.getActivity.bind(this)} jsonObj={this.state.jsonObj} updateJSON={this.fetchJSON} />
                </Route>
                <Route exact path='/activitytwo'>
                    <QuestionCard activity='Activity Two' round={1} question={1} getActivityJSON={this.getActivity.bind(this)} jsonObj={this.state.jsonObj} updateJSON={this.fetchJSON} />
                </Route>
                <Route exact path='/menu'>
                    <MenuCard />
                </Route>
                <Route exact path='/activityone/results'>
                    <ResultsCard activity='Activity One' />
                </Route>
                <Route exact path='/activitytwo/result'>
                    <ResultsCard activity='Activity Two' />
                </Route>
            </div>
        );
    }


    componentDidMount() {
        console.log('mounted container')
        this.fetchJSON();
    }


}

export default withRouter(Container);
