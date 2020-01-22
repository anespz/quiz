import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

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
            return (<tr key={row}>
                <td > {'Q' + row} </td>
                <td > {'' + items[row]} </td>
            </tr>)
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
                <div className = 'table'>
                    <div > Round 1 </div>
                    <div>
                        {this.getRowsData(results1)}
                    </div>
                    <div >Round 2</div>
                    <div>
                        {this.getRowsData(results2)}
                    </div>
                </div>
            )
        } else {
            let r = this.props.getActivityObj(name);
            let results = this.getResults(r);
            return (
                <div className = 'table'>
                    <div>
                        {this.getRowsData(results)}
                    </div>
                </div>
            )

        }
    }


    redirect() {
        this.props.history.push('/menu');
        console.log('back to menu!!')
    }

    render() {
        let table = 'Loading'
        if (this.props.jsonObj) {
            table = this.getTable();
        }
        return (
            <div className="ResultsCard">
                <div className=''> {this.state.activity} </div>
                <div className='resultsHeader'> {'Results'.toUpperCase()} </div>
                <table>
                    <thead>
                        <th > a </th>
                        <th > b </th>
                    </thead>
                    <tbody>
                        {table}
                    </tbody>
                </table>
                <div classname="menuButton">
                    <button onClick={this.redirect.bind(this)}> MENU </ button>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        console.log('did mount!');
        this.setState({ order: this.props.question, activity: this.props.activity })
        this.fetchJSON(this.state.activity);
    }
}

export default withRouter(ResultsCard);
