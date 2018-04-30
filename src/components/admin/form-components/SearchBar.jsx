import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { capFirstLetter, slugify } from 'lib/utilities';

import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';

class SearchResult extends React.PureComponent {
  onClick = () => {
    this.props.handleClick({
      id: this.props.id,
      title: this.props.title,
      slug: this.props.slug,
    });
  };

  render() {
    return (
      <MenuItem
        {...this.props.isNew && { leftIcon: <ContentAdd /> }}
        primaryText={this.props.title}
        onClick={this.onClick}
        disabled={this.props.disabled}
      />
    );
  }
}

SearchResult.propTypes = {
  title: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  id: PropTypes.number,
  disabled: PropTypes.bool,
  isNew: PropTypes.bool,
};

SearchResult.defaultProps = {
  id: null,
  disabled: false,
  isNew: false,
};

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', suggestions: [] };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
          disabled={this.props.disabled}
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
                  key={slugify(this.state.value.trim())}
                >
                  <SearchResult
                    id={null}
                    title={this.state.value.trim()}
                    slug={slugify(this.state.value.trim())}
                    handleClick={this.handleClick}
                    disabled={this.props.disabled}
                    isNew
                  />
                </div>
              )}
            {this.state.suggestions.map(item => (
              <div
                className={`${searchBarResultClass} search-bar-${
                  this.props.mode
                }`}
                key={item.id}
              >
                <SearchResult
                  id={item.id}
                  title={item.title}
                  slug={item.slug}
                  handleClick={this.handleClick}
                  disabled={this.props.disabled}
                />
              </div>
            ))}
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
};

SearchBar.defaultProps = {
  fullWidth: false,
  disabled: false,
  enableAdd: false,
};
