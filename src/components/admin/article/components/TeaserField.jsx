import React from 'react';

import { capFirstLetter } from 'lib/utilities';

export default class MaxLengthField extends React.Component {
    constructor(props){
	super(props);
	this.onChange = this.onChange.bind(this);
    }

    onChange(event){
	console.log(event);
    }
    
  render() {
    return (
          <TextField
            name={this.props.name}
            floatingLabelText={
              `${capfirstletter(this.props.name)} (${this.props.value.length} of ${this.props.maxLen} characters)`
            }
            value={this.props.value}
            disabled={this.props.disabled}
            onChange={this.onChange}
            multiLine
            rows={2}
            fullWidth
          />
    );
  }
}
