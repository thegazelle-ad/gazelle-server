import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import { googleClientID } from 'lib/utilities';
import _ from 'lodash';
import GoogleLogin from 'react-google-login';

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.onGoogleResponse = this.onGoogleResponse.bind(this);
  }

  handleRedirect() {
    // Add additional query params to new url
    let url = this.props.location.query.url || '';
    if (url) {
      _.forEach(this.props.location.query, (q, name) => {
        if (name !== 'url') {
          url = `${url}&${name}=${q}`;
        }
      });
    }
    browserHistory.push(url);
  }

  onGoogleResponse(response) {
    if (response.error) {
      alert(`Google Login Failed.\n${response.error}`);
      return;
    }

    const token = { data: response.tokenId };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/googlelogin', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        this.handleRedirect();
      } else if (xhr.readyState === XMLHttpRequest.DONE) {
        alert(`Google Login Failed.\n${xhr.status}: ${xhr.statusText}`);
      }
    };

    xhr.send(JSON.stringify(token));
  }

  render() {
    return (
      <div className="googleOuterDiv">
        <GoogleLogin
          clientId={googleClientID}
          onSuccess={this.onGoogleResponse}
          onFailure={this.onGoogleResponse}
          className="googleButton"
        >
          <div className="googleInnerDiv">
            <span className="googleSpan">Login with Google</span>
          </div>
        </GoogleLogin>
      </div>
    );
  }
}
