import React from 'react';
import _ from 'lodash';

import BaseComponent from 'lib/BaseComponent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ListSelector extends BaseComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event, ...restArgs) {
    this.props.update(restArgs[1]);
  }

  render() {
    return (
      <SelectField
        floatingLabelText={this.props.type}
        maxHeight={400}
        value={this.props.chosenType}
        onChange={this.onChange}
        disabled={this.props.disabled}
        autoWidth={false}
        style={{ width: 200 }}
      >
        {
          _.map(this.props.types, type => (
            <MenuItem
              value={type.slug}
              key={type.slug}
              primaryText={type.name}
            />
          ))
        }
      </SelectField>
    );
  }
}
