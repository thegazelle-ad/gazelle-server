import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import { hash } from 'lib/utilities';
import _ from 'lodash';

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      passwordValue: "",
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
    if (hash(pass) !== 8692053) {
      window.alert("Incorrect password");
      e.target.password.value = "";
    }
    else {
      // Otherwise it is correct and we let the site redirect the client
      let url = this.props.location.query.url || "";
      if (url) {
        _.forEach(this.props.location.query, (q, name) => {
          if (name != "url") {
            url += "&" + name + "=" + q;
          }
        });
      }
      browserHistory.push(url);
    }
  }

  render() {
    return(
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
