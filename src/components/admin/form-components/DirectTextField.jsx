import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextField from 'material-ui/TextField';

export class DirectTextField extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = event => props.onUpdate(event.target.value);
  }

  render() {
    const passedProps = _.omit(this.props, 'onUpdate');
    return <TextField onChange={this.onChange} {...passedProps} />;
  }
}

DirectTextField.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  ...TextField.propTypes,
};
