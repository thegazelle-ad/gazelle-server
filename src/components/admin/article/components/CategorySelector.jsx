import React from 'react';
import _ from 'lodash';

import BaseComponent from 'lib/BaseComponent';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Component extends BaseComponent {
  render() {
    return (
      <SelectField
        floatingLabelText="Category"
        maxHeight={400}
        value={this.props.chosenCategory}
        onChange={this.props.update}
        disabled={this.props.disabled}
        autoWidth={false}
        style={{ width: 200 }}
      >
        {
          _.map(this.props.categories, category => (
            <MenuItem
              value={category.slug}
              key={category.slug}
              primaryText={category.name}
            />
          ))
        }
      </SelectField>
    );
  }
}
