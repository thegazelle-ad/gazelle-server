import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { browserHistory } from 'react-router';

// material-ui
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import CircularProgress from 'material-ui/CircularProgress';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';
import ListSelector from './form-components/ListSelector';

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
};

class SemesterController extends FalcorController {
  constructor(props) {
    super(props);
    this.falcorToState = this.falcorToState.bind(this);
    this.updateSemester = currentSemester =>
      this.safeSetState({
        currentSemester,
      });
    this.safeSetState({
      currentSemester: null, // semester id
    });
  }

  static getFalcorPathSets() {
    return [
      ['semesters', 'byId', { from: 0, to: 5 }, ['id', 'name']],
      ['semesters', 'latest', 'info', ['id']],
    ];
  }

  falcorToState(data) {
    this.safeSetState({
      currentSemester: data.semesters.latest.info.id,
    });
  }

  componentWillMount() {
    super.componentWillMount(this.falcorToState);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentSemester !== this.state.currentSemester) {
      if (this.state.currentSemester === null) {
        browserHistory.push('/semesters');
      } else {
        const semesterName = this.state.data.semesters.byId[
          this.state.currentSemester
        ].name;
        browserHistory.push(`/semesters/${semesterName}`);
      }
    }
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data || !this.state.data.semesters) {
        return (
          <div>
            An error occured while fetching semester data, please contact the
            development team
          </div>
        );
      }

      const semesters = _.toArray(this.state.data.semesters.byId);

      return (
        <div>
          <h1>Semesters</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <div style={styles.tabs}>
              <h2>Edit a semester</h2>
              <Divider />
              <p>Select a semester</p>
              <ListSelector
                label="Semester"
                chosenElement={this.state.currentSemester}
                update={this.updateSemester}
                elements={semesters}
              />
            </div>
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

const EnhancedSemesterController = withModals(SemesterController);
export { EnhancedSemesterController as SemesterController };
