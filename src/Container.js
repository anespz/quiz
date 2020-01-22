import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import QuestionCard from './Cards/QuestionCard.js';
import './App.css';
import styles from './Style.js'
import { Route } from 'react-router-dom'
import MenuCard from './Cards/MenuCard.js';
import ResultsCard from './Cards/ResultsCard.js';
import {View} from 'react-native'

class Container extends Component {

    constructor(props) {
        // Note: ended up using a local copy of the .json file (./mockAPI.json) for testing, 
        // that I ran on a local server (http://localhost:3000/payload') using 'json-server --watch mockAPI.json'
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Hacky, but can be added to avoid CORS during development.
        var fullUrl = proxyUrl + 'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json';
        super(props);
        this.state = {
            jsonUrl: { fullUrl },
            jsonObj: null
        };
    }

    /**
     * Fetches the full API document (not good for scale) once component is mounted.
     * Stores it as state.jsonObj. Because fetch is async, this has caused some bugs
     * when later accessing the jsonObj, eg. the error we get at first load of the question cards. 
     * 
     * The temporary solution to run through the demo is to refresh the page, which fixes it. 
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
                this.setState({
                    jsonObj: doc,
                }, () => {
                    console.log('state set!!!');
                });
            })
            .catch(error => console.log('Error:', error));
    }

    /**
     * Return activity object (contains either question objects or "question objects" that are actually rounds)
     */
    getActivityObj(name) {
        console.log(this.state.jsonObj);  
        let o = this.state.jsonObj;
        for (let i = 0; i < o.activities.length; i++) {
            let act = o.activities[i];
            if (act.activity_name === name) {
                return act;
            }
        }
    }

    /**
     * Return round object (contains question objects)
     * @param {String} name - the type of activity 
     * @param {Int} round - the round order
     */
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

    /**
     * Returns a question object (contains the details for each question)
     * @param {String} name - the type of activity 
     * @param {Int} round - the round order
     * @param {Int} order - the question order
     */
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

    /**
     * Render with routing - depending on which path is pushed to history, 
     * render the route with that path. 
     * 
     * Properties of each card are currently a bit bloated. 
     */
    render() {
        return (
            <View className="container" style={styles.container}>
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
                <Route exact path='/'>
                    <MenuCard jsonObj={this.state.jsonObj}/>
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
            </View>
        );
    }


    componentDidMount() {
        console.log('mounting container')
        this.fetchJSON();
        console.log('mount done')
    }


}

export default withRouter(Container);
