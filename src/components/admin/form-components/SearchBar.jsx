import React from 'react';
import PropTypes from 'prop-types';
import { capFirstLetter, slugify } from 'lib/utilities';

import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';

export class SearchBar extends React.PureComponent {
  handleChange() {
    this.props.updateSuggestions(this.state.value);
  }

  handleClick(item) {
    this.props.handleClick(item);
  }

  render() {
    const searchBarClass = 'search-bar';
    const searchBarResultClass = 'search-bar-result';
    const slug = this.props.enableAdd
      ? slugify(this.props.category, this.state.value)
      : '';
    return (
      <div
        className={`${searchBarClass} ${searchBarClass}-${this.props.category}`}
      >
        <TextField
          floatingLabelText={`Search for ${capFirstLetter(
            this.props.category,
          )}`}
          hintText={capFirstLetter(this.props.category)}
          fullWidth={this.props.fullWidth}
          value={this.state.value}
          /* eslint-disable react/jsx-no-bind */
          onChange={this.handleChange.bind(this)}
          /* eslint-enable react/jsx-no-bind */
        />
        <div>
          <Menu style={!this.props.fullWidth && { width: 200 }}>
            {this.props.enableAdd &&
              this.props.suggestions.length === 0 &&
              this.state.value && (
                <div
                  className={`${searchBarResultClass} search-bar-${
                    this.props.category
                  }`}
                  key={slug}
                >
                  {/* eslint-disable react/jsx-no-bind */}
                  <MenuItem
                    leftIcon={<ContentAdd />}
                    primaryText={this.state.value}
                    onClick={this.handleClick.bind(this, {
                      title: this.state.value,
                      slug,
                      id: null,
                    })}
                    disabled={this.props.disabled}
                  />
                  {/* eslint-enable react/jsx-no-bind */}
                </div>
              )}
            {/* eslint-disable react/jsx-no-bind */
            this.props.suggestions.map(item => (
              <div
                className={`${searchBarResultClass} search-bar-${
                  this.props.category
                }`}
                key={item.slug}
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
  suggestions: PropTypes.shape([
    {
      title: PropTypes.string.isRequired,
      slug: PropTypes.string,
      id: PropTypes.number.isRequired,
    },
  ]),
  updateSuggestions: PropTypes.func.isRequired,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  enableAdd: PropTypes.bool,
  category: PropTypes.string.isRequired,
};

SearchBar.defaultProps = {
  suggestions: [],
  fullWidth: false,
  disabled: false,
  enableAdd: false,
};
