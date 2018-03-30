import React from 'react';
import PropTypes from 'prop-types';

import { RequiredTextField } from 'components/admin/form-components/validated-fields';

class TitleField extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = event => props.onUpdate(event.target.value);
  }

  render() {
    return (
      <RequiredTextField
        onChange={this.onChange}
        value={this.props.title}
        disabled={this.props.disabled}
        floatingLabelText="Title"
        fullWidth
      />
    );
  }
}

TitleField.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};

TitleField.defaultProps = {
  disabled: false,
};

export default TitleField;
