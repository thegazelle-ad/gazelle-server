import React from 'react';

import { capFirstLetter } from 'lib/utilities';
import TextField from 'material-ui/TextField';

export default class MaxLenTextField extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    this.props.onUpdate(event.target.value.substr(0, this.props.maxLen));
  }

  render() {
    return (
      <TextField
        name={this.props.name}
        floatingLabelText={
          `${capFirstLetter(this.props.name)} (${this.props.value.length}` +
                           ` of ${this.props.maxLen} characters)`
        }
        value={this.props.value}
        disabled={this.props.disabled}
        onChange={this.onChange}
        multiLine
        fullWidth
      />
    );
  }
}
