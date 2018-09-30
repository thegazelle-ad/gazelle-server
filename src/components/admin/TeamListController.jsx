import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { has, slugify } from 'lib/utilities';
import LoadingOverlay from './LoadingOverlay';

// Custom Components
import ListSelector from 'components/admin/form-components/ListSelector';
import { ShortRequiredTextField } from 'components/admin/form-components/validated-fields';

// material-ui
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import AddTeam from 'material-ui/svg-icons/social/group-add';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
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

class TeamListController extends FalcorController {
  constructor(props) {
    super(props);
    this.createTeam = this.createTeam.bind(this);
    this.falcorToState = this.falcorToState.bind(this);
    this.updateTeam = currentTeam => this.safeSetState({ currentTeam });
    this.updateSemester = currentSemester =>
      this.safeSetState({ currentSemester });
    this.inputName = inputName => this.safeSetState({ inputName });
    this.inputSlug = inputSlug => this.safeSetState({ inputSlug });
    this.safeSetState({
      saving: false,
      inputName: '',
      inputSlug: '',
      currentTeam: null, // contains id of team
      currentSemester: 'none',
    });
  }

  static getFalcorPathSets() {
    return [
      ['teams', 'byIndex', { from: 0, to: 9 }, ['id', 'name']],
      [
        'semesters',
        'latest',
        { length: 10 },
        'teamInfo',
        ['id', 'name', 'slug'],
      ],
    ];
  }

  falcorToState(data) {
    this.safeSetState({
      currentTeam: data.teams.byIndex[0].id,
    });
  }

  componentWillMount() {
    super.componentWillMount(this.falcorToState);
  }

  createTeam(e) {
    e.preventDefault();
    const { inputName: name, inputSlug: slug } = this.state;

    if (slug !== slugify(slug)) {
      this.props.displayAlert(
        'Your slug is not in the right format. Our programatically suggested ' +
          `substitute is: ${slugify(slug)}. ` +
          'Feel free to use it or change it to something else',
      );
      return;
    }

    if (has.call(this.state.data.teams.byIndex, name)) {
      this.props.displayAlert(
        'This team has already been created, you cannot create it again',
      );
      return;
    }

    const callback = () => {
      this.safeSetState({
        saving: false,
      });
    };
    this.safeSetState({
      saving: true,
    });
    this.falcorCall(
      ['teams', 'bySlug', 'createTeam'],
      [{ slug, name }],
      undefined,
      undefined,
      undefined,
      callback,
    );
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data || !this.state.data.teams || !this.state.data.semesters) {
        return (
          <div>
            An error occured while fetching team data, please contact the
            development team
          </div>
        );
      }

      const teams = _.toArray(this.state.data.semesters.latest).map(
        index => index.teamInfo,
      );

      return (
        <div>
          <h1>Teams</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <Tabs>
              <Tab label="EDIT" icon={<Edit />}>
                <div style={styles.tabs}>
                  <h2>Edit a team</h2>
                  <Divider />
                  <p>Select a team</p>
                  <ListSelector
                    label="Team"
                    chosenElement={this.state.currentTeam}
                    update={this.updateTeam}
                    elements={teams}
                    disabled={this.state.saving}
                  />
                </div>
                {this.state.saving ? <LoadingOverlay /> : null}
              </Tab>
              <Tab label="ADD NEW" icon={<AddTeam />}>
                <div style={styles.tabs}>
                  <h2>Create a new team</h2>
                  <Divider />
                  {this.state.saving ? <div>Creating team...</div> : null}
                  <form onSubmit={this.createTeam}>
                    <ShortRequiredTextField
                      floatingLabelText="Team Name"
                      value={this.state.inputName}
                      onUpdate={this.inputName}
                      disabled={this.state.saving}
                    />
                    <br />
                    <ShortRequiredTextField
                      floatingLabelText="Input URL Slug"
                      value={this.state.inputSlug}
                      onUpdate={this.inputSlug}
                      disabled={this.state.saving}
                    />
                    <br />
                    <br />
                    <RaisedButton
                      type="submit"
                      label="Create Team"
                      disabled={!(this.state.inputSlug && this.state.inputName)}
                      primary
                      style={styles.buttons}
                    />
                  </form>
                </div>
              </Tab>
            </Tabs>
          </Paper>
          {this.props.children}
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

const EnhancedTeamListController = withModals(TeamListController);
export { EnhancedTeamListController as TeamListController };
