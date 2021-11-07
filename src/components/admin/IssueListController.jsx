import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { browserHistory, Link } from 'react-router';
import { updateFieldValue } from './lib/form-field-updaters';
import { has, stringToInt } from 'lib/utilities';
import LoadingOverlay from './LoadingOverlay';

// material-ui
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AddIssue from 'material-ui/svg-icons/av/library-add';
import Home from 'material-ui/svg-icons/action/home';
import Reorder from 'material-ui/svg-icons/action/reorder';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import Description from 'material-ui/svg-icons/action/description';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import CircularProgress from 'material-ui/CircularProgress';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

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
};

class IssueListController extends FalcorController {
  constructor(props) {
    super(props);
    this.addIssue = this.addIssue.bind(this);
    this.fieldUpdaters = {
      name: updateFieldValue.bind(this, 'name', undefined),
      issueNumber: updateFieldValue.bind(this, 'issueNumber', undefined),
      currentIssue: updateFieldValue.bind(this, 'currentIssue', {
        isMaterialSelect: true,
      }),
    };
    this.safeSetState({
      saving: false,
      name: '',
      issueNumber: '',
      currentIssue: 'none',
    });
  }

  static getFalcorPathSets() {
    return ['issues', 'byNumber', { from: 1, to: 400 }, 'name'];
  }

  componentWillMount() {
    const falcorCallback = data => {
      const issues = Object.keys(data.issues.byNumber).map(key =>
        stringToInt(key),
      );
      const nextIssue = Math.max(...issues) + 1;
      // Set default values
      this.safeSetState({
        name: `Issue ${nextIssue}`,
        issueNumber: nextIssue.toString(),
      });
    };
    super.componentWillMount(falcorCallback);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentIssue !== this.state.currentIssue) {
      const issueNumber = this.state.currentIssue;
      if (issueNumber === 'none') {
        browserHistory.push('/issues');
      } else {
        browserHistory.push(`/issues/${issueNumber}/main`);
      }
    }
  }

  addIssue(e) {
    e.preventDefault();
    const { name: issueName, issueNumber } = this.state;

    if (Number.isNaN(stringToInt(issueNumber))) {
      this.props.displayAlert('the issue number given is not a valid number');
      return;
    }

    if (has.call(this.state.data.issues.byNumber, issueNumber)) {
      this.props.displayAlert(
        'This issue has already been created, you cannot create it again',
      );
      return;
    }

    const issue = {
      name: issueName,
      issue_number: stringToInt(issueNumber),
    };

    const callback = () => {
      // Set next issue default
      const nextIssue = (stringToInt(issueNumber) + 1).toString();
      this.safeSetState({
        saving: false,
        name: `Issue ${nextIssue}`,
        issueNumber: nextIssue,
      });
    };
    this.safeSetState({
      saving: true,
    });
    this.falcorCall(
      ['issues', 'byNumber', 'addIssue'],
      [issue],
      undefined,
      undefined,
      undefined,
      callback,
    );

    browserHistory.push(`/issues/${issueNumber}/main`);
  }

  getSelectedTab() {
    const path = this.props.location.pathname.split('/'); // Parse URL pathname

    switch (path[3]) {
      case 'main':
      case 'articles':
      case 'categories':
        return path[3];

      default:
        throw new Error(
          'Invalid selected tab (getSelectedTab, IssueListController)',
        );
    }
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data || !this.state.data.issues) {
        return (
          <div>
            An error occured while fetching issue data, please contact the
            development team
          </div>
        );
      }
      const currentIssueNumber = this.props.params.issueNumber;
      if (currentIssueNumber && Number.isNaN(stringToInt(currentIssueNumber))) {
        return <div>Invalid URL</div>;
      }
      const baseUrl = `/issues/${currentIssueNumber}`;

      const data = this.state.data.issues.byNumber;

      return (
        <div>
          <h1>Issues</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <Tabs>
              <Tab label="EDIT" icon={<Edit />}>
                <div style={styles.tabs}>
                  <h2>Edit an issue</h2>
                  <Divider />
                  <p>Select an issue</p>
                  <DropDownMenu
                    maxHeight={400}
                    value={this.state.currentIssue}
                    onChange={this.fieldUpdaters.currentIssue}
                  >
                    <MenuItem
                      value="none"
                      key="none"
                      primaryText="None Chosen"
                    />
                    {_.map(data, (issue, issueNumber) => {
                      const { name } = issue;
                      return (
                        <MenuItem
                          value={issueNumber}
                          key={issueNumber}
                          primaryText={name}
                        />
                      );
                    }).reverse()}
                  </DropDownMenu>
                </div>
                {this.state.saving ? <LoadingOverlay /> : null}
              </Tab>
              <Tab label="ADD NEW" icon={<AddIssue />}>
                <div style={styles.tabs}>
                  <h2>Add a new issue</h2>
                  <Divider />
                  {this.state.saving ? <div>Adding issue...</div> : null}
                  <form onSubmit={this.addIssue}>
                    <TextField
                      name="name"
                      value={this.state.name}
                      floatingLabelText="Issue Name"
                      disabled={this.state.saving}
                      onChange={this.fieldUpdaters.name}
                    />
                    <br />
                    {/* Don't use type=number here as it had weird problems in Chrome */}
                    <TextField
                      name="issueNumber"
                      value={this.state.issueNumber}
                      floatingLabelText="Issue Number"
                      disabled={this.state.saving}
                      onChange={this.fieldUpdaters.issueNumber}
                    />
                    <br />
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
            </Tabs>
          </Paper>
          <Paper style={styles.paper} zDepth={2}>
            {currentIssueNumber ? (
              <div>
                <Tabs value={this.getSelectedTab()}>
                  <Tab
                    label="MAIN"
                    value="main"
                    icon={<Home />}
                    containerElement={<Link to={`${baseUrl}/main`} />}
                  />
                  <Tab
                    label="ARTICLES"
                    value="articles"
                    icon={<Description />}
                    containerElement={<Link to={`${baseUrl}/articles`} />}
                  />
                  <Tab
                    label="CATEGORIES"
                    value="categories"
                    icon={<Reorder />}
                    containerElement={<Link to={`${baseUrl}/categories`} />}
                  />
                </Tabs>
                <div style={styles.tabs}>
                  <h2>Issue {currentIssueNumber}</h2>
                  <Divider />
                </div>
              </div>
            ) : null}
            {this.props.children}
          </Paper>
        </div>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }
}

const EnhancedIssueListController = withModals(IssueListController);
export { EnhancedIssueListController as IssueListController };
