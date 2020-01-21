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

    saveState() {
        let doc = this.props.jsonObj;
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
    }

    

    getRowsData = () => {
        let items = this.state.results;
        let keys = Object.keys(this.state.results);
        return Object.keys(items).map((row) => {
            console.log('row: ' + row + '  value: ' + items[row])
            return (<tr key={row}>
                <td > {'Q' + row} </td>
                <td > {'' + items[row]} </td>
            </tr>)
        });
    }

    redirect() {
        this.props.history.push('/menu');
        console.log('back to menu!!')
    }

    render() {
        return (
            <div className="ResutlsCard">
                <div className=''> {this.state.activity} </div>
                <div className='resultsHeader'> {'Results'.toUpperCase()} </div>
                <table>
                    <thead>
                        <th > a </th>
                        <th > b </th>
                    </thead>
                    <tbody>
                        {this.getRowsData()}
                    </tbody>
                </table>
                <div classname="menuButton">
                    <button onClick={this.redirect.bind(this)}> MENU </button>
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
