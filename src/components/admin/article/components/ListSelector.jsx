import React from 'react';
import _ from 'lodash';

import BaseComponent from 'lib/BaseComponent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ListSelector extends BaseComponent {
  render() {
    return (
      <SelectField
        floatingLabelText={this.props.type}
        maxHeight={400}
        value={this.props.chosenType}
        onChange={this.props.update}
        disabled={this.props.disabled}
        autoWidth={false}
        style={{ width: 200 }}
      >
        {_.map(this.props.types, type => (
          <MenuItem value={type.slug} key={type.slug} primaryText={type.name} />
        ))}
      </SelectField>
    );
  }
}
