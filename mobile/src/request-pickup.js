import React, { Component } from 'react';
import RequestSentScreen from './request-sent-screen';
import axios from 'axios';

export default class RequestPickup extends Component{
  constructor(props){
    super(props);
    this.state = {
      requestSent: false,
    };
  }

  renderRequestPickupSection = () => {
      if (this.state.requestSent === false){
          return (
              <section class="hero is-info is-fullheight">
                <div class="hero-body">
                  <div class="container pickup-container">
                    <h1 class="title">
                      Pick up Garbage at:
                    </h1>
                    <h2 class="subtitle">
                      {this.props.address}
                    </h2>
                        <div className="pickup-section">
                             <button className="button is-success is-large pickup-button" onClick={this.requestSent}>Pick Up</button>
                            <div className="pickup-footer">
                              <button className="button is-danger logout-button">Logout</button>
                          </div>
                       </div>
                  </div>
                </div>
              </section>
          );
      }
      if (this.state.requestSent === true){
          return (<RequestSentScreen />);
      } 
  }

  requestSent = () => {
    let latitude = 0;
    let longitude = 0;
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.props.address}&key=AIzaSyAG7S5dn1Xz296FofdLrT5N-2Hn4tQ8MyA`)
      .then(data => {
        console.log('geocoded');
        latitude = data.data.results[0].geometry.location.lat;
        longitude = data.data.results[0].geometry.location.lng;
      })
      .then(res => {
        axios.get(`http://f7c43a95.ngrok.io/pickup/?lng=${latitude}&lat=${longitude}`)
          .then(res => {})
          .catch(err=> {})
      })
      .catch(err => {
        console.log(err);
      })
    this.setState({ requestSent: true });
  }

  
 

  render() {
    return (
      <div className="requestPickup">
          {this.renderRequestPickupSection()}
      </div>
    );
  }


}

