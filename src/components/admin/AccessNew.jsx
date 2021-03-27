import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { updateFieldValue } from './lib/form-field-updaters';
import { browserHistory } from 'react-router';

// material-ui
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

const styles = {
  buttons: {
    marginTop: 24,
    marginBottom: 12,
  },
};

class AccessNew extends FalcorController {
  constructor(props) {
    super(props);
    this.fieldUpdaters = {
      name: updateFieldValue.bind(this, 'name', undefined),
      email: updateFieldValue.bind(this, 'email', undefined),
    };
    this.safeSetState({ 
      email: '',
      name: '',
      saving: false,
    })
  }
  
  handleDialogClose() {
    browserHistory.push('/access');
  }

  addNewAdmin() {
    return 0
  }

  static getFalcorPathSets() {
    return [];
  }

  render() {
    return (
      <Dialog
        title="Add new admin"
        open
        autoScrollBodyContent
        onRequestClose={this.handleDialogClose}
        contentStyle={{ width: '40%', margin: 'auto' }}
      >
        <TextField
          value={this.state.email}
          floatingLabelText="Email"
          onChange={this.fieldUpdaters.email}
        />
        <br />
        <TextField
          value={this.state.name}
          floatingLabelText="Name"
          onChange={this.fieldUpdaters.name}
        />
        <br />
        <RaisedButton
          label="Add"
          type="submit"
          primary
          style={styles.buttons}
          onClick={this.addNewAdmin}
        />
      </Dialog>
    )
  }
}

const EnhancedAccessNew = withModals(AccessNew);
export { EnhancedAccessNew as AccessNew };
