import React, { Component } from 'react';
import Login from './login';
import RequestPickup from './request-pickup';
import './App.css';

export default class App extends Component { 
  constructor(props){
    super(props);
    this.state = {
      users: [
        { "username": "john", "password": "qwerty", "address": "855 city"},
        { "username": "fred", "password": "qwerty2", "address": "322 city"}
      ],
      verified: false
    };
  }


  renderSection = () => {
    if (this.state.verified === false){
      return <Login users={this.state.users} verifyUser={this.verifyUser}/>
    }
    else{
      return <RequestPickup />
    }
  }

  verifyUser = () => {
    this.setState({ verified: true });
  }

  render(){
    return (
        <div className="app">
          {this.renderSection()}
        </div>
    );
  }
}

 