import React from 'react';
import QuestionCard from './Cards/QuestionCard.js';
import './App.css';
import {Route, Redirect, Switch} from 'react-router-dom'
import MenuCard from './Cards/MenuCard.js';
import ResultsCard from './Cards/ResultsCard.js';
import Container from './Container.js';



function App() {
  return (
    <div className="App">
      <Container />
      {/* <Route exact path='/activityone'>
        <QuestionCard activity='Activity One' question={1}/>
      </Route>
      <Route exact path='/activitytwo'>
        <QuestionCard activity='Activity Two' question={1}/>
      </Route>
      <Route exact path='/menu'>
        <MenuCard />
      </Route>
      <Route exact path='/resultsone'>
        <ResultsCard activity='Activity One'/>
      </Route>
      <Route exact path='/resultstwo'>
        <ResultsCard activity='Activity Two'/>
      </Route> */}
    </div>
  );
}

export default App;
