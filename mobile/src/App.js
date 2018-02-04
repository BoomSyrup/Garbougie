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
        { "username": "antoine", "password": "tomtom", "address": "4243 Hide A Way Road, San Jose, CA"},
        { "username": "byron", "password": "tomtom", "address": "3770 24th St, San Francisco, CA"}
      ],
      verified: false,
      currentUser: null,
      currentUserAddress: null,
    };
  }


  renderSection = () => {
    if (this.state.verified === false){
      return <Login users={this.state.users} verifyUser={this.verifyUser} logOut={this.logOut}/>
    }
    else{
      return <RequestPickup user={this.state.currentUser} address={this.state.currentUserAddress} logOut={this.logOut}/>
    }
  }

  verifyUser = (verifiedUser, verifiedAddress) => {
    this.setState({ verified: true, currentUser: verifiedUser, currentUserAddress: verifiedAddress });
  }

  logOut = () => {
    this.setState({ verified: false, currentUser: null, currentUserAddress: null});
  }  

  render(){
    return (
        <div className="app">
          {this.renderSection()}
        </div>
    );
  }
}

 