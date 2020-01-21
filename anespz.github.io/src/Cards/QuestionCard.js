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
      order: '',
      jsonUrl: { fullUrl },
    };
  }

  getRound() {

  }

  getTitle() {
    if (this.props.activity === 'Activity One') {
      return this.props.activity;
    } else {
      return this.props.activity + ' / ROUND ' + this.state.round;
    }
  }

  getQuestion() {
    console.log('getting Q')
    let act = this.props.getActivityObj(''+this.props.activity);
    for (let i = 0; i < act.questions.length; i++) {
      let qu = act.questions[i];
      if (this.props.activity === 'Activity Two') {
        if (qu.order === this.state.round) {
          for (let j = 0; j < qu.questions.length; j++) {
            let qu2 = qu.questions[j];
            if (qu2.order === this.state.order) {
              return qu2.stimulus;
            }
          }
        }
      }
      else {
        return qu.stimulus;
      }
    }
  }


  getNumQuestions() {
    let act = this.props.getActivityObj(''+this.props.activity);
    if (this.props.activity === 'Activity One') {
      console.log('act one length: ' + act.questions.length)
      return act.questions.length;
    } else { // Activity Two
      for (let i = 0; i < act.questions.length; i++) {
        let qu = act.questions[i];
        if (qu.order === this.state.round) {
          console.log('round: ' + this.state.round)
          console.log('act two length: ' + qu.questions.length)
          return qu.questions.length
        }
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
    let act = this.props.getActivityObj('' + this.props.activity);
    for (let i = 0; i < act.questions.length; i++) {
      var qu = act.questions[i];
      if (this.props.activity === 'Activity One') { // Activity Two
        if (qu.order === this.state.order) {
          qu.user_answers.unshift(answer); // most recent answer will be collected from user_answers[0]
          return new Promise((resolve, reject) => {
            this.setState({
              jsonObj: o
            }, () => { console.log('UPDATED'); resolve(this.props.jsonObj) })
          });
        }
      } else { // Activity Two
        if (qu.order === this.state.round) {
          for (let j = 0; j < qu.questions.length; j++) {
            let qu2 = qu.questions[j];
            if (qu2.order === this.state.order) {
              qu2.user_answers.unshift(answer); // most recent answer will be collected from user_answers[0]
              return new Promise((resolve, reject) => {
                this.setState({
                  jsonObj: o
                }, () => { console.log('UPDATED'); resolve(this.props.jsonObj) })
              });
            }
          }
        }
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
        fetch('http://localhost:3000/payload', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newJsonObj),
        })
          .then((response) => response.json())
          .then(() => {
            let path = this.props.history.location.pathname + '/results/'
            this.redirect(path);
          })
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  // /**
  //  * Only used for testing
  //  * @param {*} o 
  //  */
  // clearAnswers() {
  //   let o = this.props.jsonObj;
  //   let act = this.props.getActivityObj(''+this.props.activity)
  //   console.log(act)
  //   for (let j = 0; j < act.questions.length; j++) {
  //     var qu = act.questions[j];
  //     qu.user_answers = []; // most recent answer will be collected from user_answers[0]
  //   }
  //   fetch('http://localhost:3000/payload', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(o)
  //   })
  //     .then((response) => response.json())
  //     .then(() => {
  //       console.log('Success: Cleared API');
  //       let path = this.props.history.location.pathname + '/results/'
  //       this.redirect(path);
  //     })
  //   this.setState({
  //     jsonObj: o,
  //     order: 0
  //   })
  // }


  getNumRounds() {
    let act = this.props.getActivityObj(this.props.activity);
    if (this.props.activity === 'Activity Two') {
      console.log('act one length: ' + act.questions.length)
      return act.questions.length;
    } else {
      console.log('this activity has no rounds');
    }
  }

  redirect(path) {
    if (this.state.order === this.getNumQuestions()) {
      if (this.props.activity === 'Activity One') {
        console.log('reached end!!');
        this.props.history.push(path);
      } else {
        if (this.state.round === this.getNumRounds()) {
          console.log('rounds finished!')
          this.props.history.push(path);
        }
        let nextRound = this.state.round + 1;
        this.setState({ order: 1, round: nextRound });
      }
    } else {
      let nextQuestion = this.state.order + 1;
      this.setState({ order: nextQuestion });
      console.log('next q : ' + this.state.order);
    }
  }


  render() {
    let qu = '';
    let update = () => console.log("update: null");
    if (this.props.jsonObj) { // check if the object has loaded
      console.log('should get Q now')
      let act = this.props.activity;
      qu = this.props.getQuestionObj(act, this.state.round, this.state.order).stimulus;
      update = this.updateAnswer.bind(this);
    }
    return (
      <div className="QuestionCard" >
        <div className="QuestionHeader">
          <p>{this.getTitle()} </p>
          <p>Q{this.state.order}.</p>
        </div>
        <div className="Question">
          {qu}
        </div>
        <div className="AnswerSection">
          <AnswerButton onClick={update} answer='CORRECT' />
          <AnswerButton onClick={update} answer='INCORRECT' />
        </div>
        {/* <div>
          <button onClick={this.clearAnswers.bind(this)}>clear</button>
        </div> */}
      </div>
    );
  }


  componentDidMount() {
    console.log('did mount')
    this.setState({ order: this.props.question, activity: this.props.activity})
    if (this.props.activity === 'Activity Two') {
      console.log('setting state round');
      this.setState({ round: this.props.round, jsonObj: this.props.jsonObj });
    }
    console.log('did update')
    console.log(this.props.activity)  
  }
}

export default withRouter(QuestionCard);
