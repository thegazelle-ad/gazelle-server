import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import { hash } from 'lib/utilities';
import _ from 'lodash';

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

  render() {
    return (
      <div>
        <form className="pure form" onSubmit={this.handleSubmit}>
          Input Password:<br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoFocus
          />
          <input
            type="submit"
            className="pure-button"
            value="Enter Editor Tools"
          />
        </form>
      </div>
    );
  }
}
