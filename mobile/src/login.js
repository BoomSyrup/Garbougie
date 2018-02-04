import React, { Component } from 'react';

export default class Login extends Component{

  constructor(props){
    super(props);
    this.state = {
      invalidLogin: null,
    };
  }

  handleLogin(event){
  	event.preventDefault();
  	const user = this.refs.loginInput.value;
  	const pass = this.refs.passwordInput.value;


  	for (var i = 0; i < this.props.users.length; i++){
      if ((this.props.users[i].username === user) && (this.props.users[i].password === pass)){
        this.props.verifyUser(user, this.props.users[i].address);
        return;
      }
    }
    this.setState({ invalidLogin: true });
  }

  renderLogin = () => {
    if (!this.state.invalidLogin){
      return (
      
      // <div className="login">
      //    <h1>Garbougie</h1>
      //     <form className="login-form" onSubmit={this.handleLogin.bind(this)} >
      //         <input type="text" placeholder="Username" ref="loginInput"></input>
      //         <input type="text" placeholder="Password" ref="passwordInput"></input>
      //         <button className="login-button">Login</button>
      //     </form>
      //  </div>
      <section class="hero is-info is-fullheight">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Garbougie
            </h1>
            <h2 class="subtitle">
              On-demand garbage collection
            </h2>
            <div className="login">
            <form className="login-form" onSubmit={this.handleLogin.bind(this)} >
               <input type="text" placeholder="Username" ref="loginInput"></input>
               <input type="text" placeholder="Password" ref="passwordInput"></input>
               <br></br>
               <button className="button login-button is-success">Login</button>
            </form>
             </div>
          </div>
        </div>
      </section>


      )
    }
    if (this.state.invalidLogin === true){
      return (
      <section class="hero is-info is-fullheight">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Garbougie
            </h1>
            <h2 class="subtitle">
              On-demand garbage collection
            </h2>
            <div className="login">
            <form className="login-form" onSubmit={this.handleLogin.bind(this)} >
               <input type="text" placeholder="Username" ref="loginInput"></input>
               <input type="text" placeholder="Password" ref="passwordInput"></input>
               <br></br>
               <button className="button is-success">Login</button>
               <p>Invalid Login!</p>
            </form>
             </div>
          </div>
        </div>
      </section>
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
