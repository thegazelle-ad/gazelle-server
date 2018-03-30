import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import { googleClientID, isCI } from 'lib/utilities';
import _ from 'lodash';

const styles = {
  button: {
    marginTop: 36,
  },
};

function onSignInFailure(response) {
  if (response.error !== 'popup_closed_by_user') {
    window.alert(`Google Login Failed.\n${response.error}`);
  }
}

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      GoogleAPIReady: false,
    };
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleLoginCI = this.handleLoginCI.bind(this);
    this.onSignInSuccess = this.onSignInSuccess.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    const interval = setInterval(() => {
      // GoogleAPILoaded is a global var, set to true when Google platform.js script loaded
      if (window.THE_GAZELLE.googleAPILoaded) {
        // eslint-disable-line no-undef
        this.renderButton();
        window.gapi.load('auth2', () => {
          this.safeSetState({
            GoogleAPIReady: true,
          });

          const auth = window.gapi.auth2.getAuthInstance();
          if (!auth || !auth.isSignedIn.get()) {
            window.gapi.auth2.init({
              client_id: googleClientID,
            });
          } else {
            // detects user has signed in
            this.onSignInSuccess(auth.currentUser.get());
          }
        });
        clearInterval(interval);
      }
    }, 100);
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

  handleLoginCI() {
    // if CI, just let it login without interacting with Google Login popup window
    if (isCI) {
      this.handleRedirect();
    }
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

  renderButton() {
    window.gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      longtitle: true,
      onsuccess: this.onSignInSuccess,
      onfailure: onSignInFailure,
    });
  }

  render() {
    const fade = this.state.GoogleAPIReady ? 1 : 0.5;
    return (
      <div id="login-page">
        {/* eslint-disable */
        /* FIXME */}
        <div
          id="my-signin2"
          style={{
            ...styles.button,
            opacity: fade,
          }}
          onClick={this.handleLoginCI}
        />
        {/* eslint-enable */}
      </div>
    );
  }
}
