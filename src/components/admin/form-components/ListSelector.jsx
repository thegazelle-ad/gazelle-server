import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ListSelector extends React.Component {
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

ListSelector.propTypes = {
  types: PropTypes.object.isRequired,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  update: PropTypes.func,
  chosenType: PropTypes.string,
};
