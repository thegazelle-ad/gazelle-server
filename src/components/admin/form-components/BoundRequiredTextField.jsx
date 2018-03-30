import React from 'react';
import PropTypes from 'prop-types';

import { capFirstLetter } from 'lib/utilities';

import { RequiredTextField } from 'components/admin/form-components/validated-fields';

export class BoundRequiredTextField extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = event => props.onUpdate(event.target.value);
  }

  render() {
    return (
      <RequiredTextField
        onChange={this.onChange}
        value={this.props.value}
        disabled={this.props.disabled}
        floatingLabelText={capFirstLetter(this.props.label)}
        fullWidth
      />
    );
  }
}

BoundRequiredTextField.propTypes = {
  value: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string,
};

BoundRequiredTextField.defaultProps = {
  disabled: false,
  label: '',
};
