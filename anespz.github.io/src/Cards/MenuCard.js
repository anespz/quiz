import React, { Component } from 'react';
import {Link, withRouter } from "react-router-dom";

class MenuCard extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const activities = [{ "name": "Activity One" }, { "name": "Activity Two" }, { "name": "Activity Three" }, { "name": "Activity Four" }, { "name": "Activity Five" }];
    const listActivities = activities.map((a) => {
      if (a.name === 'Activity One' || a.name === 'Activity Two') {
        let path = a.name.split(' ').join('').toLowerCase();
        return <li><Link to={path}>{a.name}</Link></li>
      } else
        return <li key={a.name}>{a.name}</li>
    }
    );
    return (
      <div className="MenuCard">
        <div>
          {}
        </div>
        {listActivities}
      </div>
    );
  }
}

export default withRouter(MenuCard);
