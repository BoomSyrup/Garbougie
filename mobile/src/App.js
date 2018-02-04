import React, { Component } from 'react';
import Login from './login';
import RequestPickup from './request-pickup';
import 'bulma/css/bulma.css'

import './App.css';

export default class App extends Component { 
  constructor(props){
    super(props);
    this.state = {
      users: [
        { "username": "john", "password": "qwerty", "address": "855 Monty Circle, Santa Clara, CA"},
        { "username": "fred", "password": "qwerty2", "address": "322 city"}
      ],
      verified: false,
      currentUser: null,
      currentUserAddress: null,
    };
  }


  renderSection = () => {
    if (this.state.verified === false){
      return <Login users={this.state.users} verifyUser={this.verifyUser}/>
    }
    else{
      return <RequestPickup user={this.state.currentUser} address={this.state.currentUserAddress} />
    }
  }

  verifyUser = (verifiedUser, verifiedAddress) => {
    this.setState({ verified: true, currentUser: verifiedUser, currentUserAddress: verifiedAddress });
  }

  render(){
    return (
        <div className="app">
          {this.renderSection()}
        </div>
    );
  }
}

 