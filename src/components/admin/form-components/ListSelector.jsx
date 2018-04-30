import React from 'react';
import PropTypes from 'prop-types';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ListSelector extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = (event, index, value) => this.props.update(value);
  }

  render() {
    /* TODO - Design decision on default values */
    return (
      <SelectField
        floatingLabelText={this.props.label}
        maxHeight={400}
        value={this.props.chosenElement || 'none'}
        onChange={this.onChange}
        disabled={this.props.disabled}
        style={this.props.style}
      >
        {this.props.elements.map(type => (
          <MenuItem
            value={type.id}
            key={type.id || 'none'}
            primaryText={type.name}
          />
        ))}
      </SelectField>
    );
  }
}

ListSelector.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  update: PropTypes.func.isRequired,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  chosenElement: PropTypes.number,
  style: PropTypes.shape({}),
};

ListSelector.defaultProps = {
  label: '',
  disabled: false,
  chosenElement: undefined,
  style: {},
};
