import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { Link, browserHistory } from 'react-router';
import { setAppReady } from "lib/falcor/falcorUtils";
import http from 'http';

const HOSTNAME = process.env.NODE_ENV === "production" ?
  "admin.thegazelle.org" : process.env.NODE_ENV === "beta" ?
  "adminbeta.thegazelle.org" : "localhost";
const PORT = process.env.NODE_ENV === "production" ?
  443 : process.env.NODE_ENV === "beta" ?
  443 : 4000;

export default class EditorAppController extends BaseComponent {
  constructor(props) {
    super(props);
    this.handleDisableLink = this.handleDisableLink.bind(this);
    this.resetGhostInfo = this.resetGhostInfo.bind(this);
  }

  componentDidMount() {
    setAppReady();
  }

  handleDisableLink(e) {
    if (this.props.location.pathname === "/login") {
      e.preventDefault();
    }
  }

  restartServer() {
    const password = window.prompt("Please input the password");
    const options = {
      hostname: HOSTNAME,
      port: PORT,
      path: '/restartserver?password=' + password.toString(),
    }
    http.get(options, (res) => {
      res.on('data', (chunk) => {
        if (chunk === "restarted") {
          window.alert("Servers restarted successfully");
        }
        else if (chunk === "error") {
          window.alert("there was an error restarting the servers");
        }
        else if (chunk === "invalid") {
          window.alert("invalid password");
        }
        else {
          window.alert("unknown error");
        }
      })
    });
  }

  resetGhostInfo() {
    this.props.model.invalidate(['articlesByPage'], ['articlesBySlug']);
    browserHistory.push('/');
  }

  render() {
    return (
      <div>
        <div className="pure-g">
          <div className="pure-u-1-2">
            <h2>Gazelle Editor Tools</h2>
            <p>Please choose what you would like to edit</p>
            <ul>
              <li><Link to="/articles/page/1" activeClassName="active-link" onClick={this.handleDisableLink}>Articles</Link></li>
              <li><Link to="/authors/page/1" activeClassName="active-link" onClick={this.handleDisableLink}>Authors</Link></li>
              <li><Link to="/issues" activeClassName="active-link" onClick={this.handleDisableLink}>Issues</Link></li>
            </ul>
          </div>
          <div className="pure-u-1-2">
            <button
              type="button"
              onClick={this.restartServer}
              className="pure-button"
              style={{
                width: "15em",
                height: "10em",
                backgroundColor: "rgb(202, 60, 60)",
                float: "left",
              }}
              disabled={this.props.location.pathname === "/login"}
            >RESTART SERVERS</button>
            <button
              type="button"
              onClick={this.resetGhostInfo}
              className="pure-button"
              style={{
                width: "15em",
                height: "10em",
                backgroundColor: "green",
              }}
              disabled={true || this.props.location.pathname === "/login"}
            >REFRESH GHOST DATA <br />(Out of order)</button>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
