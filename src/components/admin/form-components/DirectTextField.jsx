import React from 'react';
import PropTypes from 'prop-types';

import TextField from 'material-ui/TextField';

export class DirectTextField extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = event => props.onUpdate(event.target.value);
  }

  render() {
    return <TextField onChange={this.onChange} {...this.props} />;
  }
}

DirectTextField.propTypes = {
  onUpdate: PropTypes.func.isRequired,
};
