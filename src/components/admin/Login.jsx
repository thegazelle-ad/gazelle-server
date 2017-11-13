import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import { hash } from 'lib/utilities';
import _ from 'lodash';
import GoogleLogin from 'react-google-login';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  buttons: {
    marginTop: 12,
    marginBottom: 24,
  },
  googleButton: {
    border: 10,
    boxSizing: 'border-box',
    display: 'inline-block',
    cursor: 'pointer',
    textDecoration: 'none',
    margin: 0,
    padding: 0,
    outline: 'none',
    position: 'relative',
    zIndex: 1,
    height: 36,
    minWidth: 88,
    borderRadius: 2,
    transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    backgroundColor: 'rgba(251, 57, 66, 0.8)',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0 1 6, rgba(0, 0, 0, 0.12) 0 1 4',
    textAlign: 'center',
  },
  googleSpan: {
    position: 'relative',
    opacity: 1,
    fontFamily: 'Roboto, sans-serif',
    fontSize: 14,
    letterSpacing: 0,
    textTransform: 'uppercase',
    fontWeight: 500,
    margin: 0,
    userSelect: 'none',
    paddingLeft: 16,
    paddingRight: 16,
    color: 'rgba(255, 255, 255, 0.87)',
  },
};

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      passwordValue: '',
    });
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePasswordChange(e) {
    this.safeSetState({
      passwordValue: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const pass = e.target.password.value;
    // eslint-disable-next-line max-len
    if (hash(pass) !== 'eaafc81d7868e1c203ecc90f387acfa4c24d1027134b0bfda6fd7c536efc5d8dd5718609a407dbfcd41e747aec331153d47733153afb7c125c558acba3fb6bcd') {
      window.alert('Incorrect password');
      e.target.password.value = ''; // eslint-disable-line no-param-reassign
    } else {
      // Otherwise it is correct and we let the site redirect the client
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
  }

  onGoogleResponse(response) {
    if (response.error) {
      alert(`Google Login Failed.\n${response.error}`);
      return;
    }

    const token = response.tokenId;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/googlelogin', false);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        browserHistory.push('/');
      } else {
        alert(`Google Login Failed.\n${xhr.status}: ${xhr.statusText}`);
      }
    };

    xhr.send(`data=${encodeURIComponent(token)}`);
  }

  render() {
    return (
      <div id="login-page">
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="password"
            type="password"
            floatingLabelText="Password"
            autoFocus
          /><br /><br />
          <RaisedButton
            type="submit"
            label="Enter Admin Interface"
            primary
            style={styles.buttons}
          />
        </form>

        <GoogleLogin
          clientId="870681894101-ce7tdp6h9fvt2jfrqaaalim1s2n48ie3.apps.googleusercontent.com"
          onSuccess={this.onGoogleResponse}
          onFailure={this.onGoogleResponse}
          style={styles.googleButton}
        >
          <span style={styles.googleSpan}>Login with Google</span>
        </GoogleLogin>
      </div>
    );
  }
}
