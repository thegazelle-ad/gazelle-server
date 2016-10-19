import BaseComponent from 'lib/BaseComponent';
import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

const H1PRIME = 4189793;
const H2PRIME = 3296731;
const BIG_PRIME = 5003943032159437;

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      passwordValue: "",
    });
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  hash(password) {
    let num = password.charCodeAt(0);
    for (let i = 1; i < password.length; i++) {
      num = ((num*256)%BIG_PRIME + password.charCodeAt(i))%BIG_PRIME;
    }
    const hash = ((num % H1PRIME) + 5*(num % H2PRIME) + 1 + 25)%BIG_PRIME;
    return hash;
  }

  handlePasswordChange(e) {
    this.safeSetState({
      passwordValue: e.target.value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const pass = e.target.password.value;
    const hash = this.hash(pass);
    if (hash !== 8692053) {
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
