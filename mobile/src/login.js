import React, { Component } from 'react';

export default class Login extends Component{
 
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      invalidLogin: null,
    };
  }

  handleLogin(event){
  	event.preventDefault();
  	const user = this.refs.loginInput.value;
  	const pass = this.refs.passwordInput.value;


  	for (var i = 0; i < this.props.users.length; i++){
      if ((this.props.users[i].username === user) && (this.props.users[i].password === pass)){
        this.props.verifyUser();
        return;
      }
    }
    this.setState({ invalidLogin: true });
  }

  renderLogin = () => {
    if (!this.state.invalidLogin){
      return (
        <div className="login">
          <h1>Garbougie</h1>
          <form className="login-form" onSubmit={this.handleLogin.bind(this)} >
              <input type="text" placeholder="Username" ref="loginInput"></input>
              <input type="text" placeholder="Password" ref="passwordInput"></input>
              <button className="login-button">Login</button>
          </form>
        </div>
      )
    }
    if (this.state.invalidLogin === true){
      return (
          <div className="login">
            <h1>Garbougie</h1>
            <form className="login-form" onSubmit={this.handleLogin.bind(this)} >
                <div className="input">
                  <input type="text" placeholder="Username" ref="loginInput"></input>
                  <input type="text" placeholder="Password" ref="passwordInput"></input>
                </div>
                <button >Login</button>
                <p className="login-button">Invalid Login!</p>
            </form>
          </div> 
      )
    }
  }

  render() {
    return (
      <div>
        {this.renderLogin()}
      </div>
    );
  }


}

