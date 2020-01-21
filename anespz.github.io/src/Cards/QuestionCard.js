import React, { Component } from 'react';
import AnswerButton from '../AnswerButton.js'
import { withRouter } from "react-router-dom";

class QuestionCard extends Component {

  constructor(props) {
    var proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Added to avoid CORS during development.
    var fullUrl = proxyUrl + 'https://s3.eu-west-2.amazonaws.com/interview.mock.data/payload.json';
    super(props);
    this.state = {
      activity: '',
      question: '',
      order: '',
      numOfQuestions: '',
      jsonUrl: { fullUrl },
    };
  }

  getQuestion() {
    let o = this.props.jsonObj;
    for (let i = 0; i < o.activities.length; i++) {
      var act = o.activities[i];
      if (act.activity_name === this.state.activity) {
        for (let j = 0; j < act.questions.length; j++) {
          var qu = act.questions[j];
          if (qu.round_title) {
            let path = '/' + this.props.history.location + '/round/';
            this.redirect(path)
          }
          if (qu.order === this.state.order) {
            // logic for activity2
            if (qu.stimulus) { return qu.stimulus; }
            else {
              return (null)
            }
          }
        }
      }
    }
  }

  getNumQuestions() {
    let o = this.props.jsonObj;
    for (let i = 0; i < o.activities.length; i++) {
      var act = o.activities[i];
      if (act.activity_name === this.state.activity) {
        return act.questions.length;
      }
    }
  }


  /**
   * Finds the exact location in the JSON doc to edit based 
   * on the QuestionCard state. 
   * @param {*} o 
   * @param {*} answer 
   * @returns Promise, resolves to state.jsonObj. 
   */
  updateJsonObj(answer) {
    let o = this.props.jsonObj;
    let act = this.props.getActivityJSON('' + this.props.activity);
    for (let j = 0; j < act.questions.length; j++) {
      var qu = act.questions[j];
      if (qu.order === this.state.order) {
        qu.user_answers.unshift(answer); // most recent answer will be collected from user_answers[0]
        return new Promise((resolve, reject) => {
          this.setState({
            jsonObj: o
          }, () => { console.log('UPDATED'); resolve(this.props.jsonObj) })
        });
      }
    }
  }


  /**
   * Responsible for fetching, modifying, and reuploading the JSON file
   * when the AnswerButton is clicked. Will not scale well with big databases, 
   * but is sufficient for this case. 
   * @param {*} userAnswer 
   */
  updateAnswer(userAnswer) {
    console.log('answer = ' + userAnswer)
    this.updateJsonObj(userAnswer)
      .then((newJsonObj) => {
        console.log('update complete, now putting: ');
        console.log('UPDATE 2:' + newJsonObj.activities[0].questions[0].stimulus);
        fetch('http://localhost:3000/payload', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newJsonObj),
        })
          .then((response) => response.json())
          .then(() => {
            console.log('Success: Updated API with ' + userAnswer);
            let path = this.props.history.location.pathname + '/results'
            this.redirect(path);
          })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  /**
   * Only used for testing
   * @param {*} o 
   */
  clearAnswers() {
    let o = this.props.jsonObj;
    let act = this.props.getActivityJSON(this.props.activity)
    console.log(act)
    for (let j = 0; j < act.questions.length; j++) {
      var qu = act.questions[j];
      qu.user_answers = []; // most recent answer will be collected from user_answers[0]
    }
    fetch('http://localhost:3000/payload', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(o)
    })
      .then((response) => response.json())
      .then(() => {
        console.log('Success: Cleared API');
        let path = this.props.history.location + '/results'
        this.redirect(path);
      })
    this.setState({
      jsonObj: o,
      order: 0
    })
  }

  redirect(path) {
    if (this.state.activity === 'Activity Two') {
    }
    if (this.state.order === this.getNumQuestions()) {
      console.log('reached end!!');
      this.props.history.push(path);
    } else {
      let nextQuestion = this.state.order + 1;
      this.setState({ order: nextQuestion });
      console.log('next q : ' + this.state.order);
    }
  }

  render() {
    let qu = '';
    let update = () => console.log("update: null");
    if (this.props.jsonObj) {
      qu = this.getQuestion();
      update = this.updateAnswer.bind(this);
    }
    return (
      <div className="QuestionCard" >
        <div className="QuestionHeader">
          <p>{this.state.activity}</p>
          <p>Q{this.state.order}.</p>
        </div>
        <div className="Question">
          {qu}
        </div>
        <div className="AnswerSection">
          <AnswerButton onClick={update} answer='CORRECT' />
          <AnswerButton onClick={update} answer='INCORRECT' />
        </div>
        <div>
          <button onClick={this.clearAnswers.bind(this)}>clear</button>
        </div>
      </div>
    );
  }


  componentDidMount() {
    console.log('didmount')
    this.setState({ order: this.props.question, activity: this.props.activity })
  }


}

export default withRouter(QuestionCard);
