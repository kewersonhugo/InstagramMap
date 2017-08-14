import React, { Component } from 'react';

class User extends Component {
  render() {
    return (
      <div>
        <h1>User ID: {this.props.match.params.user_id}</h1>
        <h1>Latitude: {this.props.match.params.lat}</h1>
        <h1>Longitude: {this.props.match.params.lng}</h1>
      </div>
    );
  }
}

export default User;
