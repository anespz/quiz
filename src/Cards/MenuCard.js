import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import styles from '../Style.js'
import {View, Text} from 'react-native';

class MenuCard extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  /**
   * Get JSX for the title and subtitle
   */
  getTitle() {
    let obj = this.props.jsonObj;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          {obj.name}
        </Text>
        <Text style={styles.subtitle}>
          {obj.heading}
        </Text>
      </View>
    );
  }

  /**
   * Get JSX for the activities, using a mock list where only Activity One and Two 
   * have been given working links. 
   */
  getActivityList() {
    const activities = [{ "name": "Activity One" }, { "name": "Activity Two" }, { "name": "Activity Three" }, { "name": "Activity Four" }, { "name": "Activity Five" }];
    const listActivities = activities.map((a) => {
      if (a.name === 'Activity One' || a.name === 'Activity Two') {
        let path = a.name.split(' ').join('').toLowerCase();
        return <Text style={styles.listelement}><Link to={path}>{a.name}</Link></Text>
      } else
        return <Text style={styles.listelement}>{a.name}</Text>
    }
    );
    return listActivities;
  }

  /**
   * Will wait for the jsonObj to load before retrieving the 
   * title for the page. The rest is rendered as usual. 
   */
  render() {
    let title = <div> </div>;
    if (this.props.jsonObj) {
      title = this.getTitle();
    }
    return (
      <View className="MenuCard" style={styles.card}>
        <View className="title" style={{ justifyContent: 'center'}}>
          {title}
        </View>
        <View style={styles.container}>
          {this.getActivityList()}
        </View>
      </View>
    );
  }
}

export default withRouter(MenuCard);
