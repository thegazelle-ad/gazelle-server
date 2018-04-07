import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { capFirstLetter } from 'lib/utilities';

import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', suggestions: [] };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.getSuggestions(event.target.value).then(result => {
      this.setState({ suggestions: _.get(result, 'suggestions', []) });
    });
    this.setState({ value: event.target.value });
  }

  handleClick(item) {
    this.setState({ value: '', suggestions: [] });
    this.props.handleClick(item);
  }

  render() {
    const searchBarClass = 'search-bar';
    const searchBarResultClass = 'search-bar-result';
    return (
      <div className={`${searchBarClass} ${searchBarClass}-${this.props.mode}`}>
        <TextField
          floatingLabelText={`Search for ${capFirstLetter(this.props.mode)}`}
          hintText={capFirstLetter(this.props.mode)}
          fullWidth={this.props.fullWidth}
          value={this.state.value}
          onChange={this.handleChange}
        />
        <div>
          <Menu
            style={this.props.fullWidth ? { width: '100%' } : { width: 200 }}
          >
            {this.props.enableAdd &&
              this.state.suggestions.length === 0 &&
              this.state.value.trim() && (
                <div
                  className={`${searchBarResultClass} search-bar-${
                    this.props.mode
                  }`}
                  key={this.props.slugify(this.state.value.trim())}
                >
                  {/* eslint-disable react/jsx-no-bind */}
                  <MenuItem
                    leftIcon={<ContentAdd />}
                    primaryText={this.state.value.trim()}
                    onClick={this.handleClick.bind(this, {
                      title: this.state.value.trim(),
                      slug: this.props.slugify(this.state.value.trim()),
                      id: null,
                    })}
                    disabled={this.props.disabled}
                  />
                  {/* eslint-enable react/jsx-no-bind */}
                </div>
              )}
            {/* eslint-disable react/jsx-no-bind */
            this.state.suggestions.map(item => (
              <div
                className={`${searchBarResultClass} search-bar-${
                  this.props.mode
                }`}
                key={item.id}
              >
                <MenuItem
                  primaryText={item.title}
                  onClick={this.handleClick.bind(this, item)}
                  disabled={this.props.disabled}
                />
              </div>
            ))
            /* eslint-enable react/jsx-no-bind */
            }
          </Menu>
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  getSuggestions: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  enableAdd: PropTypes.bool,
  slugify(props, propName) {
    if (
      props.enableAdd === true &&
      (props[propName] === undefined || typeof props[propName] !== 'function')
    ) {
      return new Error('Please provide a slugify function!');
    }
    return null;
  },
};

SearchBar.defaultProps = {
  fullWidth: false,
  disabled: false,
  enableAdd: false,
  slugify: () => {},
};
