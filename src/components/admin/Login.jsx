import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import { googleClientID } from 'lib/utilities';
import _ from 'lodash';

const style = {
  button: {
    marginTop: 36,
  },
};

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      gapiReady: false,
    };
    this.handleRedirect = this.handleRedirect.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignInSuccess = this.onSignInSuccess.bind(this);
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    document.body.appendChild(script);

    script.onload = () => {
      window.gapi.load('auth2', () => {
        this.setState({
          gapiReady: true,
        });
        if (!window.gapi.auth2.getAuthInstance()) {
          window.gapi.auth2.init({
            client_id: googleClientID,
          });
        }
      });
    };
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

  onSignInSuccess(response) {
    const token = { data: response.getAuthResponse().id_token };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/googlelogin');
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

  onSignInFailure(response) {
    alert(`Google Login Failed.\n${response.error}`);
  }

  onSignIn() {
    if (this.state.gapiReady) {
      const auth = window.gapi.auth2.getAuthInstance();
      auth.signIn().then(res => this.onSignInSuccess(res), err => this.onSignInFailure(err));
    } else {
      alert('Google API is not ready. Try again.');
    }
  }

  render() {
    return (
      <div className="g-signin2" onClick={this.onSignIn} style={style.button}></div>
    );
  }
}
