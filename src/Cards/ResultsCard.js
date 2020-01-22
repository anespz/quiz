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

    /**
     * Get the JSX for the table rows
     * @param {Object} results - either a round object or an activity object
     */
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
    /**
     * Get the JSX for the table element. 
     */
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

    /**
     * Works similar to redirect in QuestionCard.
     */
    redirect() {
        this.props.history.push('/');
    }

    /**
     * Wait for the jsonObj before trying to access data for the table. 
     */
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
    }
}

export default withRouter(ResultsCard);
