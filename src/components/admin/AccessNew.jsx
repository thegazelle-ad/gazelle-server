import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { updateFieldValue } from './lib/form-field-updaters';

// material-ui
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

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

  static getFalcorPathSets() {
    return [];
  }

  render() {
    return (
      <Dialog
        title="Add new admin"
        open
        autoScrollBodyContent
        onRequestClose={() => {}}
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
      </Dialog>
    )
  }
}

const EnhancedAccessNew = withModals(AccessNew);
export { EnhancedAccessNew as AccessNew };
