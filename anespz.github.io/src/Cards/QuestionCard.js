import React, { Component } from 'react';
import AnswerButton from '../AnswerButton.js'
import { withRouter } from "react-router-dom";
import { View, Text } from 'react-native'
import styles from '../Style.js'

/**
 * The 
 */
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


  getTitle() {
    if (this.props.activity === 'Activity One') {
      return this.props.activity;
    } else {
      return this.props.activity + ' / ROUND ' + this.state.round;
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


  getNumQuestions() {
    let act = this.props.getActivityObj('' + this.props.activity);
    if (this.props.activity === 'Activity One') {
      return act.questions.length;
    } else { // Activity Two
      for (let i = 0; i < act.questions.length; i++) {
        let qu = act.questions[i];
        if (qu.order === this.state.round) {
          return qu.questions.length
        }
      }
    }
  }


  getNumRounds() {
    let act = this.props.getActivityObj(this.props.activity);
    if (this.props.activity === 'Activity Two') {
      return act.questions.length;
    } else {
      console.log('this activity has no rounds');
    }
  }


  /**
   * When a question is answered, use this function to decide: 
   * go to next question, next round, or to a new card?
   * Missing is a redirect to a "New Round" card with a timer
   * in between sets of rounds, but ran out of time. 
   * 
   * @param {String} path - the new path to push to history
   */
  redirect(path) {
    if (this.state.order === this.getNumQuestions()) {
      if (this.props.activity === 'Activity One') {
        this.props.history.push(path);
      } else { // Activity Two
        if (this.state.round === this.getNumRounds()) {
          this.props.history.push(path);
        }
        let nextRound = this.state.round + 1;
        this.setState({ order: 1, round: nextRound });
      }
    } else {
      let nextQuestion = this.state.order + 1;
      this.setState({ order: nextQuestion });
    }
  }


  /**
   * This render is a bit troublesome, as the wait for this.props.jsonObj
   * does not fully hinder the error messages caused by the async fetch in Container.js. 
   * An alternative approach should probably be used. 
   * 
   * Gets question info from its Parent component, Container, which holds the jsonObj and 
   * relevant data retrieval functions. 
   */
  render() {
    let qu = '';
    let update = () => console.log("update: null");
    if (this.props.jsonObj) { // check if the object has loaded
      let act = this.props.activity;
      qu = this.props.getQuestionObj(act, this.state.round, this.state.order).stimulus;
      update = this.updateAnswer.bind(this);
    }
    return (
      <View className="QuestionCard" style={styles.card}>
        <Text style={styles.title}>
          {this.getTitle()}
        </Text>
        <Text style={styles.subtitle}>
          Q{this.state.order}.
        </Text>
        <Text style={styles.listelement}>
          {qu}
        </Text>
        <View style={styles.buttonview}>
          <button onClick={() => update('CORRECT')}>{'CORRECT'} </button>
          <button onClick={() => update('INCORRECT')}>{'INCORRECT'} </button>
        </View>
      </View>
    );
  }

  /**
   * Maybe not needed. 
   */
  componentDidMount() {
    this.setState({ order: this.props.question, activity: this.props.activity })
    if (this.props.activity === 'Activity Two') {
      this.setState({ round: this.props.round, jsonObj: this.props.jsonObj });
    }
  }
}

export default withRouter(QuestionCard);
