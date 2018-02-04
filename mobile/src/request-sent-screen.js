import React, { Component } from 'react';

export default class RequestSentScreen extends Component{
 
  constructor(props){
    super(props);
    this.state = {
      progressBarStage: 50
      // 4 stages are Request Sent,
    };
  }

  renderRequestSentScreen(){
    return (
      //<div>
      //  <div className="request-sent-screen">
      //    <h2>Your Garbage will be picked up Tommorrow</h2>
      //    <button className="cancel-button">Cancel Request</button>
      //    <div className="bar">Todo: loading bar here</div>
      //  </div>
      //</div> 

        <section class="hero is-success is-fullheight">
          <div class="hero-body">
            <div class="container">
              <h1 class="title">
                Garbage Truck is on the way!
              </h1>
              <h2 class="subtitle">
                That was easy.
              </h2>
              <progress class="progress is-link is-large" value={this.state.progressBarStage} max="100"></progress>
              <div className="progress-pointer">
                <div className="quarter">^</div>
                <div className="quarter">^</div>
              </div>
              <div className="last-progress-pointer"><div>^</div></div>
              <div className="progress-labels">
                <div className="quarter">Request Received</div>
                <div className="quarter">On Route</div>
              </div>
              <div className="last-label-pointer"><div>Complete!</div></div>
              <button className="button is-danger last-button" onClick={this.props.logOut}>Log Out</button>
            </div>
          </div>
        </section>
    );
  }

  render() {
    return (
      <div>
        {this.renderRequestSentScreen()}
      </div>
    );
  }


}

