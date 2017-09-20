import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { debounce } from 'lib/utilities';
import _ from 'lodash';
import moment from 'moment';

import { updateFieldValue } from 'components/editor/lib/form-field-updaters';

// material-ui
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

export default class EditorSearchBar extends BaseComponent {
  constructor(props) {
    super(props);
    this.fieldUpdaters = {
      searchValue: updateFieldValue.bind(this, 'searchValue', undefined),
    };
    this.safeSetState({
      searchValue: '',
      searchSuggestions: [],
    });

    this.debouncedGetSuggestions = debounce(() => {
      const query = this.state.searchValue;
      if (!(query.trim())) {
        this.safeSetState({ searchSuggestions: [] });
        return;
      }
      let pathSets = [];
      let fields;
      switch (this.props.mode) {
        case 'articles':
          // Add required fields
          fields = this.props.fields.concat(['title', 'slug']);
          if (this.props.showPubDate) {
            fields.push('published_at');
          }
          // Remove duplicates
          fields = _.uniq(fields);

          pathSets.push(
            ['search', 'posts', query, { length: this.props.length }, fields]
          );
          if (this.props.extraPathSets) {
            const extraPathSets = this.props.extraPathSets.map(pathSet => (
              ['search', 'posts', query, { length: this.props.length }].concat(pathSet)
            ));
            pathSets = pathSets.concat(extraPathSets);
          }
          break;
        case 'authors':
          // Add required fields and remove duplicates
          fields = _.uniq(this.props.fields.concat(['name', 'slug']));

          pathSets.push(
            ['search', 'authors', query, { length: this.props.length }, fields]
          );
          if (this.props.extraPathSets) {
            const extraPathSets = this.props.extraPathSets.map(pathSet => (
              ['search', 'authors', query, { length: this.props.length }].concat(pathSet)
            ));
            pathSets = pathSets.concat(extraPathSets);
          }
          break;
        default:
          throw new Error('Invalid mode was passed to EditorSearchBar');
      }

      this.props.model.get(...pathSets)
      .then((x) => {
        if (!x) {
          this.safeSetState({ searchSuggestions: [] });
          return;
        }
        let suggestions = x.json.search;
        if (this.props.mode === 'articles') {
          suggestions = suggestions.posts[query];
        } else {
          suggestions = suggestions.authors[query];
        }
        const suggestionsArray = _.map(suggestions, value => value);
        this.safeSetState({ searchSuggestions: suggestionsArray });
      });
    }, this.props.debounceTime || 250);
  }

  componentDidUpdate() {
    this.debouncedGetSuggestions();
  }

  componentWillReceiveProps() {
    this.safeSetState({
      searchValue: '',
      searchSuggestions: [],
    });
  }

  handleClick(article) {
    this.safeSetState({
      searchValue: '',
      searchSuggestions: [],
    });
    this.props.handleClick(article);
  }

  render() {
    if (this.props.mode === 'articles') {
      return (
        <div>
          <TextField
            floatingLabelText="Search for Articles"
            hintText="Article"
            fullWidth
            value={this.state.searchValue}
            onChange={this.fieldUpdaters.searchValue}
          />
          <div>
            <Menu>
              {
                this.state.searchSuggestions.map((article) => {
                  let textShown = article.title;
                  if (this.props.showPubDate) {
                    let date;
                    if (article.published_at) {
                      date = `Published: ${moment(article.published_at).format('MMM DD, YYYY')}`;
                    } else {
                      date = 'Unpublished';
                    }
                    textShown += ` - ${date}`;
                  }
                  return (
                    <div key={article.slug}>
                      {/* eslint-disable react/jsx-no-bind */}
                      <MenuItem
                        primaryText={textShown}
                        onClick={this.handleClick.bind(this, article)}
                        disabled={this.props.disabled}
                      />
                      {/* eslint-enable react/jsx-no-bind */}
                    </div>
                  );
                })
              }
            </Menu>
          </div>
        </div>
      );
    } else if (this.props.mode === 'authors') {
      return (
        <div>
          <TextField
            floatingLabelText="Search for Staff"
            hintText="Staff"
            value={this.state.searchValue}
            onChange={this.fieldUpdaters.searchValue}
          />
          <div>
            <Menu style={{ width: 200 }}>
              {
                this.state.searchSuggestions.map((author) => (
                  <div key={author.slug}>
                    {/* eslint-disable react/jsx-no-bind */}
                    <MenuItem
                      primaryText={author.name}
                      onClick={this.handleClick.bind(this, author)}
                      disabled={this.props.disabled}
                    />
                    {/* eslint-enable react/jsx-no-bind */}
                  </div>
                ))
              }
            </Menu>
          </div>
        </div>
      );
    }
    return <div style={{ color: 'red' }}>Sorry, an error occured, please contact developers</div>;
  }
}

/* eslint-disable consistent-return */
EditorSearchBar.propTypes = {
  model: React.PropTypes.object.isRequired,
  fields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  mode: React.PropTypes.oneOf(['authors', 'articles']).isRequired,
  length: React.PropTypes.number.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  showPubDate: React.PropTypes.bool,
  style: React.PropTypes.object,
  debounceTime: React.PropTypes.number,
  disabled: React.PropTypes.any,
  placeholder: React.PropTypes.string,
  // Each of these will be concatenated onto the base search path
  // so don't supply the base search path
  extraPathSets: (props, propName, componentName) => {
    const prop = props[propName];
    if (!prop) {
      // Wasn't supplied so nevermind
      return;
    }
    let error = new Error(
      `Invalid prop ${propName} supplied to ${componentName}. It must be an array of pathSets.`
    );
    if (!(prop instanceof Array)) {
      return error;
    }
    const valid = prop.every((value) => {
      if (!(value instanceof Array)) {
        return false;
      } else if (value[0] === 'search') {
        error = new Error(
          `Invalid prop ${propName} supplied to ${componentName}. ` +
          'Just add the extension, do not add "search"... as this is already considered.'
        );
        return false;
      }
      return true;
    });
    if (!valid) {
      return error;
    }
  },
};
