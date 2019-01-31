import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// Lib
import { has, slugify, debounce } from 'lib/utilities';
import FalcorController from 'lib/falcor/FalcorController';
import { getTeamPath } from 'routes/admin-helpers';

// Custom Components
import ListSelector from 'components/admin/form-components/ListSelector';
import { ShortRequiredTextField } from 'components/admin/form-components/validated-fields';
import { SearchableAuthorsSelector } from 'components/admin/form-components/searchables';
import LoadingOverlay from './LoadingOverlay';
import SaveButton from 'components/admin/article/components/SaveButton';

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
    this.updateTeam = this.updateTeam.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.updateTeamMembers = teamMembers => this.safeSetState( teamMembers );
    this.inputName = inputName => this.safeSetState({ inputName });
    this.inputSlug = inputSlug => this.safeSetState({ inputSlug });
    this.safeSetState({
      changed: false,
      saving: false,
      inputName: '',
      inputSlug: '',
      currentTeam: null, // contains id of team
      teamIndex: null,
      teamMembers: [],
    });

    this.debouncedHandleFormStateChanges = debounce(() => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving) return;
    
      const changedFlag = this.isFormChanged();
      if (changedFlag !== this.state.changed) {
        this.safeSetState({ changed: changedFlag });
      }
    }, 500);
  }

  static getFalcorPathSets(params) {
    return [
      ['teams', 'byIndex', { from: 0, to: 9 }, ['id', 'name']],
      [
        'semesters',
        'byName',
        params.semesterName,
        { length: 10 },
        'teamInfo',
        ['id', 'name', 'slug'],
      ],
      [
        'semesters',
        'byName',
        params.semesterName,
        { length: 10 },
        'members',
        { length: 30 },
        ['id', 'name'],
      ],
    ];
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.params.semesterName !== this.props.params.semesterName) {
      // semester has been changed, reset teams
      this.safeSetState({
        currentTeam: null,
        teamIndex: null,
      });
    }
    if (prevState.currentTeam !== this.state.currentTeam && this.state.currentTeam != null) {
      // team has been changed, update URL
      const semester = this.props.params.semesterName;
      const semesterData = this.state.data.semesters.byName[semester];
      if (this.state.teamIndex !== null) {
        const team = semesterData[this.state.teamIndex].teamInfo.slug;
        browserHistory.push(getTeamPath(semester, team));
      } else {
        browserHistory.push(getTeamPath(`/semesters/${semester}`));
      }
    }
    if (
      prevProps.params.semesterName === this.props.params.semesterName &&
      prevState.currentTeam === this.state.currentTeam &&
      this.isFormFieldChanged(prevState.teamMembers, this.state.teamMembers) &&
      this.state.ready
    ) {
      // The update wasn't due to a change in semester or teams
      this.debouncedHandleFormStateChanges();
    }
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

  updateTeam(currentTeam, teams) {
    this.safeSetState({ currentTeam });
    const semesterData = this.state.data.semesters.byName[this.props.params.semesterName];
    for (let i = 0; i < teams.length; i++) {
      if (teams[i].id === currentTeam) {
        this.safeSetState({
          teamIndex: i,
          teamMembers: _.toArray(semesterData[i].members),
          // should only happen when team is changed, find a way to incorporate prevProps?
        });
      }
    }
  }

  handleSaveChanges = async () => {
    if (!this.isFormChanged()) {
      throw new Error(
        'Tried to save changes but there were no changes. ' +
          'the save changes button is supposed to be disabled in this case',
      );
    }
  }
  
  areAuthorsChanged(currentAuthors, falcorAuthors) {
    const falcorAuthorsArray = _.map(falcorAuthors, author => author);
    return (
      falcorAuthorsArray.length !== currentAuthors.length ||
      currentAuthors.some(
        author =>
          falcorAuthorsArray.find(
            falcorAuthor => author.id === falcorAuthor.id,
          ) === undefined,
      )
    );
  }

  isFormChanged() {
    const falcorData = this.state.data.semesters.byName[this.props.params.semesterName];
    return this.areAuthorsChanged(this.state.teamMembers, falcorData[this.state.teamIndex].members);
  }

  isFormFieldChanged(a, b) {
    return a !== b && !(!a && !b);
  }

  render() {
    if (this.state.ready) {
      if (
        !this.state.data ||
        !this.state.data.teams ||
        !this.state.data.semesters
      ) {
        return (
          <div>
            An error occured while fetching team data, please contact the
            development team
          </div>
        );
      }

      const semesterTeams = this.state.data.semesters.byName[this.props.params.semesterName]
      const teams = _.toArray(semesterTeams).map(index => index.teamInfo);
      // should probably make teams part of state to make my life easier but can't because have to wait for falcor to fetch new semester data

      const currentTeamSlug = this.props.params.teamSlug;

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
                    update={(currentTeam) => this.updateTeam(currentTeam, teams)}
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
          <div>
            {currentTeamSlug ? (
              <div>
                <h1>Members</h1>
                <Divider />
                <Paper style={styles.paper} zDepth={2}>
                  <div style={styles.tabs}>
                    <SearchableAuthorsSelector
                      elements={this.state.teamMembers}
                      onChange={this.debouncedHandleFormStateChanges}
                      onUpdate={this.updateTeamMembers}
                      disabled={this.state.saving}
                      mode="staff"
                      fullWidth
                    />
                    <SaveButton
                      onClick={this.handleSaveChanges}
                      style={styles.buttons}
                      saving={this.state.saving}
                      changed={this.state.changed}
                    />
                  </div>
                </Paper>
              </div>
            ) : null}
          </div>
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
