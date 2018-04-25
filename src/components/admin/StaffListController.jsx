import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { slugify } from 'lib/utilities';
import { browserHistory } from 'react-router';
import { SearchableAuthors } from 'components/admin/form-components/searchables';
import { updateFieldValue } from './lib/form-field-updaters';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

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
    marginTop: 24,
    marginBottom: 12,
  },
  staffMenu: {
    display: 'inline-block',
    margin: 0,
  },
};

class StaffListController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleCreateStaffChange = this.handleCreateStaffChange.bind(this);
    this.createStaff = this.createStaff.bind(this);
    this.fieldUpdaters = {
      inputName: updateFieldValue.bind(this, 'inputName', undefined),
      inputSlug: updateFieldValue.bind(this, 'inputSlug', undefined),
    };
    this.safeSetState({
      createStaffValid: false,
      inputName: '',
      inputSlug: '',
    });
  }

  static getFalcorPathSets() {
    return [];
  }

  handleClickStaff(staff) {
    browserHistory.push(`/staff/${staff.slug}`);
  }

  handleCreateStaffChange() {
    const validFlag = this.state.inputSlug && this.state.inputName;
    if (validFlag !== this.state.createStaffValid) {
      this.safeSetState({ createStaffValid: validFlag });
    }
  }

  createStaff(e) {
    e.preventDefault();
    const slug = this.state.inputSlug;
    const name = this.state.inputName;

    if (slug !== slugify(slug)) {
      this.props.displayAlert(
        'Your slug is not in the right format. Our programatically suggested ' +
          `substitute is: ${slugify(slug)}. ` +
          'Feel free to use it or change it to something else',
      );
      return;
    }

    // Check if the slug is already taken
    this.props.model.get(['staff', 'bySlug', slug, 'slug']).then(x => {
      if (x.json.staff.bySlug[slug].slug !== undefined) {
        // Something was found, which means the slug is taken
        this.props.displayAlert(
          'This slug is already taken, please change to another one',
        );
        return;
      }
      // Create the author
      const callback = () => {
        // I commented out the below alert mostly because it made E2E tests more bothersome
        // but I also think it's maybe not necessary since we already opening the modal with
        // the editor on successful creation, if we wanted in the future if we make a small
        // similar framework to this for snackbars we could maybe use one of those for that.
        // The big dangerous alert also doesn't seem right here (with the warning sign and everything)
        // await this.props.displayAlert('Staff added successfully');
        browserHistory.push(`/staff/${slug}`);
      };
      this.falcorCall(
        ['staff', 'bySlug', 'createStaff'],
        [{ slug, name }],
        undefined,
        undefined,
        undefined,
        callback,
      );
    });
  }

  render() {
    const ID = 'staff-list';
    if (this.state.ready) {
      return (
        <div id={ID}>
          <h1>Staff</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <Tabs>
              <Tab label="EDIT" icon={<ModeEdit />}>
                <div id={`${ID}-edit-tab`} style={styles.tabs}>
                  <h2>Edit Staff</h2>
                  <Divider />
                  <SearchableAuthors
                    fields={['slug']}
                    length={3}
                    handleClick={this.handleClickStaff}
                    fullWidth
                  />
                </div>
              </Tab>
              <Tab label="ADD NEW" icon={<PersonAdd />}>
                <div id={`${ID}-add-new-tab`} style={styles.tabs}>
                  <h2>Add New Staff</h2>
                  <Divider />
                  <form
                    onSubmit={this.createStaff}
                    onChange={this.handleCreateStaffChange}
                  >
                    <TextField
                      type="text"
                      name="name"
                      hintText="John Appleseed"
                      floatingLabelText="Input Name"
                      value={this.state.inputName}
                      onChange={this.fieldUpdaters.inputName}
                    />
                    <br />
                    <TextField
                      type="text"
                      name="slug"
                      hintText="john-appleseed"
                      floatingLabelText="Input URL Slug"
                      value={this.state.inputSlug}
                      onChange={this.fieldUpdaters.inputSlug}
                    />
                    <br />
                    <RaisedButton
                      label="Create Staff"
                      type="submit"
                      disabled={!this.state.createStaffValid}
                      primary
                      style={styles.buttons}
                    />
                  </form>
                </div>
              </Tab>
            </Tabs>
            <Divider />
          </Paper>
          {this.props.children}
          <br />
        </div>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
        {this.props.children}
      </div>
    );
  }
}

const EnhancedAuthorListController = withModals(StaffListController);
export { EnhancedAuthorListController as StaffListController };
