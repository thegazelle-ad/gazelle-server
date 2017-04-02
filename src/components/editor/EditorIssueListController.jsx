import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { browserHistory, Link } from 'react-router';

// material-ui
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AddIssue from 'material-ui/svg-icons/av/library-add';
import Home from 'material-ui/svg-icons/action/home';
import Reorder from 'material-ui/svg-icons/action/reorder';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import Description from 'material-ui/svg-icons/action/description';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class EditorIssueListController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.addIssue = this.addIssue.bind(this);
    this.safeSetState({
      saving: false,
      name: '',
      number: '',
      value: 'none',
    });
  }
  static getFalcorPathSets() {
    return ['issuesByNumber', {from: 1, to: 200}, 'name'];
  }

  handleChange(e, index, value) {
    this.setState({ value: value }, () => {
      const issueNumber = value;
      if (issueNumber === "none") {
        browserHistory.push("/issues");
        return;
      }
      const currentUrl = this.props.location.pathname;
      const urlArray = currentUrl.split('/');
      urlArray[2] = issueNumber.toString();
      const newUrl = urlArray.join('/');
      browserHistory.push(newUrl+'/main');
    })
  }

  addIssue(e) {
    e.preventDefault();
    const issueName = this.state.name;
    const issueNumber = this.state.issueNumber;

    if (this.state.data.issuesByNumber.hasOwnProperty(issueNumber)) {
      window.alert("This issue has already been created, you cannot create it again");
      return;
    }

    const issue = {};
    issue['name'] = issueName;
    issue['issueNumber'] = parseInt(issueNumber);

    const callback = () => {
      this.safeSetState({
        saving: false,
        name: "",
        number: "",
      });
    }
    this.safeSetState({
      saving: true,
    });
    this.falcorCall(['issuesByNumber', 'addIssue'], [issue],
      undefined, undefined, undefined, callback);

    browserHistory.push('/issues/'+issueNumber+'/main');
  }

  render() {
    const styles = {
      paper: {
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'left',
        display: 'inline-block',
      },
      tabs: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 15,
      },
      buttons: {
        marginTop: 12,
        marginBottom: 24,
      },
    }

    if (this.state.ready) {
      if (!this.state.data) {
        return (
          <div>
            An error occured while fetching issue data,
            please contact the development team
          </div>
        );
      }
      const issueNumber = this.props.params.issueNumber;
      if (issueNumber && isNaN(parseInt(issueNumber))) {
        return <div>Invalid URL</div>;
      }
      const baseUrl = "/issues/" + issueNumber;

      const data = this.state.data.issuesByNumber;
      const issues = Object.keys(data).map((key) => {return parseInt(key)});
      const nextIssue = Math.max(...issues)+1;

      return (
        <div>
          <h1>Issues</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <Tabs>
              <Tab label="ADD NEW" icon={<AddIssue />}>
                <div style={styles.tabs}>
                  <h2>Add a new issue</h2>
                  <Divider />
                  {
                    this.state.saving ?
                      <div>Adding issue...</div> :
                      null
                  }
                  <form
                    onSubmit={this.addIssue}
                  >
                    <TextField
                      name="name"
                      defaultValue={"Issue " + nextIssue}
                      floatingLabelText="Issue Name"
                      disabled={this.state.saving}
                      onChange={e => this.setState({ name: e.target.value })}
                    /><br />
                    {/* Don't use type=number here as it had weird problems in Chrome */}
                    <TextField
                      name="issueNumber"
                      defaultValue={nextIssue}
                      floatingLabelText="Issue Number"
                      disabled={this.state.saving}
                      onChange={e => this.setState({ number: e.target.value })}
                    /><br />
                    <br />
                    <RaisedButton
                      type="submit"
                      label="Create Issue"
                      primary
                      style={styles.button}
                    />
                  </form>
                </div>
              </Tab>
              <Tab label="EDIT" icon={<Edit />}>
                <div style={styles.tabs}>
                  <h2>Edit an issue</h2>
                  <Divider />
                  <p>Select an issue</p>
                  <DropDownMenu
                    maxHeight={400}
                    value={this.state.value}
                    onChange={this.handleChange}
                  >
                    <MenuItem value="none" key="none" primaryText="None Chosen" />
                    {
                      _.map(data, (issue, number) => {
                        const name = issue.name;
                        return <MenuItem value={number} key={number} primaryText={name} />;
                      }).reverse()
                    }
                  </DropDownMenu>
                </div>
              </Tab>
            </Tabs>
          </Paper>
          <Paper style={styles.paper} zDepth={2}>
            {
              this.props.params.issueNumber ?
                <div>
                  <Tabs>
                    <Tab
                      label="MAIN"
                      icon={<Home />}
                      containerElement={<Link to={baseUrl+"/main"} />}
                    />
                    <Tab
                      label="ARTICLES"
                      icon={<Description />}
                      containerElement={<Link to={baseUrl+"/articles"} />}
                    />
                    <Tab
                      label="CATEGORIES"
                      icon={<Reorder />}
                      containerElement={<Link to={baseUrl+"/categories"} />}
                    />
                  </Tabs>
                  <div style={styles.tabs}>
                    <h2>Issue {this.props.params.issueNumber}</h2>
                    <Divider />
                  </div>
                </div>
                : null
            }
            {this.props.children}
          </Paper>
        </div>
      );
    }
    else {
      return (
        <div className="pure-g">
          <div className="pure-u-3-8">
            <h3>Issues</h3>
            <p>loading...</p>
          </div>
          <div className="pure-u-1-8"></div>
          <div className="pure-u-1-2">
            {this.props.children}
          </div>
        </div>
      );
    }
  }
}

// {
//   _.map(data, (issue, number) => {
//     const name = issue.name;
//     return <option value={number} key={number}>{name}</option>;
//   }).reverse()
// }
