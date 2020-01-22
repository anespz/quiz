import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styles from '../Style.js';
import { View, Text } from 'react-native';

class ResultsCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: '',
            order: '',
            results: {}
        }
    }

    fetchJSON(activity, question) {
        // var proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Added to avoid CORS during development.
        fetch('http://localhost:3000/payload')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response;
            })
            .then(response => response.json())
            .then(doc => {
                for (let i = 0; i < doc.activities.length; i++) {
                    var act = doc.activities[i];
                    console.log(act);
                    if (act.activity_name === this.state.activity) {
                        console.log('found act!');
                        let results = {};
                        for (let j = 0; j < act.questions.length; j++) {
                            var qu = act.questions[j];
                            let k = qu.order;
                            let val = qu.is_correct === (qu.user_answers[0] === 'CORRECT');
                            results[k] = val;
                        }
                        this.setState(prevState => ({
                            results: results,
                            numQuestion: act.questions.length
                        }));
                    }
                }
            })
            .catch(error => console.log('Error:', error));
    }

    /**
     * Get results from the json document. 
     * @param {*} questionObj - an object containing an activity (task one) or a round (task two)
     */
    getResults(obj) {
        let results = {}
        for (let j = 0; j < obj.questions.length; j++) {
            var qu = obj.questions[j];
            let k = qu.order;
            let val = qu.is_correct === (qu.user_answers[0] === 'CORRECT');
            results[k] = val;
            console.log(results);
        }
        return results;
    }

    getRowsData(results) {
        let items = results;
        return Object.keys(items).map((row) => {
            console.log('row: ' + row + '  value: ' + items[row])
            return (<View style={styles.row}>
                <Text style={styles.cell}> {'Q' + row} </Text>
                <Text style={styles.cell} > {'' + items[row]} </Text>
            </View>)
        });

    }

    getTable() {
        let name = this.props.activity;
        console.log(name);
        if (name === 'Activity Two') {
            let r1 = this.props.getRoundObj(name, 1);
            let results1 = this.getResults(r1);
            let r2 = this.props.getRoundObj(name, 2);
            let results2 = this.getResults(r2);
            return (
                <View style={styles.table}>
                    <Text style={styles.row}> Round 1 </Text>
                    {this.getRowsData(results1)}
                    <Text style={styles.row}>Round 2</Text>
                    {this.getRowsData(results2)}
                </View>
            )
        } else {
            let r = this.props.getActivityObj(name);
            let results = this.getResults(r);
            return (
                <View style={styles.table}>
                    {this.getRowsData(results)}
                </View>
            )

        }
    }


    redirect() {
        this.props.history.push('/menu');
        console.log('back to menu!!')
    }

    render() {
        let table = <div />
        if (this.props.jsonObj) {
            table = this.getTable();
        }
        return (
            <View style={styles.card}>
                <Text style={styles.title}> {this.state.activity.toUpperCase()} </Text>
                <Text style={styles.subtitle}> {'Results'.toUpperCase()} </Text>
                <View >
                    {table}
                </View>
                <View style={styles.buttonview}>
                    <button onClick={this.redirect.bind(this)}> MENU </ button>
                </View>
            </View>
        );
    }

    componentDidMount() {
        console.log('did mount!');
        this.setState({ order: this.props.question, activity: this.props.activity })
        this.fetchJSON(this.state.activity);
    }
}

export default withRouter(ResultsCard);
