import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { capFirstLetter, slugify, debounce } from 'lib/utilities';
import _ from 'lodash';
import moment from 'moment';

import { updateFieldValue } from 'components/admin/lib/form-field-updaters';
import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';

// material-ui
import TextField from 'material-ui/TextField';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import ContentAdd from 'material-ui/svg-icons/content/add';

const requiredFields = {};

requiredFields.articles = (props) =>
  (props.showPubDate
    ? ['title', 'slug', 'published_at']
    : ['title', 'slug']);
const ArticlesSearch = (item, props, onClick) => {
  let date = '';
  if (props.showPubDate) {
    date = (item.published_at)
      ? `Published: ${moment(item.published_at).format('MMM DD, YYYY')}`
      : date = 'Unpublished';
  }
  const showText = `${item.titel} - ${date}`;
  return (
    <div className={`search-bar-result search-bar-${props.category}`} key={item.slug}>
      <MenuItem
        primaryText={showText}
        onClick={onClick}
        disabled={props.disabled}
      />
    </div>
  );
};
ArticlesSearch.propTypes = {
  category: React.PropTypes.string.isRequired,
  showPubDate: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
};

requiredFields.authors = () => ['name', 'slug'];
const AuthorsSearch = (item, props, onClick) => (
  <div className={`search-bar-result search-bar-${props.category}`} key={item.slug}>
    {/* eslint-disable react/jsx-no-bind */}
    <MenuItem
      primaryText={item.name}
      onClick={onClick}
      disabled={props.disabled}
    />
    {/* eslint-enable react/jsx-no-bind */}
  </div>
);
AuthorsSearch.propTypes = {
  category: React.PropTypes.string.isRequired,
  disabled: React.PropTypes.bool,
};

export default class SearchBar extends BaseComponent {
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

      const fields = _.uniq(
        this.props.fields.concat(requiredFields[this.props.category](this.props))
      );
      let pathSets = this.props.extraPathSets || [];
      pathSets = pathSets.reduce((arr, pathSet) => arr.push([
        'search',
        'posts',
        query,
          { length: this.props.length },
      ].concat(pathSet)
      ), [['search', this.props.category, query, { length: this.props.length }, fields]]);

      this.props.model.get(...pathSets)
      .then((x) => {
        if (!x) {
          this.safeSetState({ searchSuggestions: [] });
          return;
        }
        x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
        // This ternary statement will be removed when database
        // renaming completes, see ref #327.
        const suggestions = (this.props.category === 'articles')
          ? x.json.search.posts[query]
          : x.json.search[this.props.category][query];

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
    const searchBarClass = 'search-bar';
    const menuComponent = (this.props.category === 'articles')
      ? ArticlesSearch
      : AuthorsSearch;
    let slug = '';
    return (
      <div className={`${searchBarClass} ${searchBarClass}-${this.props.category}`}>
        <TextField
          floatingLabelText={`Search for ${capFirstLetter(this.props.category)}`}
          hintText={capFirstLetter(this.props.category)}
          fullWidth={this.props.fullWidth}
          value={this.state.searchValue}
          onChange={this.fieldUpdaters.searchValue}
        />
        <div>
          <Menu style={!this.props.fullWidth && { width: 200 }}>
            {
              this.props.enableAdd &&
              this.state.searchValue &&
              this.state.searchSuggestions.length === 0 &&
              (slug = slugify(this.props.category, this.state.searchValue)) &&
              (
                <div className={`search-bar-result search-bar-${this.props.category}`} key={slug}>
                  {/* eslint-disable react/jsx-no-bind */}
                  <MenuItem
                    leftIcon={<ContentAdd />}
                    primaryText={this.state.searchValue}
                    onClick={this.handleClick.bind(this, { value: this.state.searchValue, slug })}
                    disabled={this.props.disabled}
                  />
                  {/* eslint-enable react/jsx-no-bind */}
                </div>
              )
            }
            { /* eslint-disable react/jsx-no-bind */
              this.state.searchSuggestions.map(
                (item) => menuComponent(item, this.props, this.handleClick.bind(this, item))
              )
              /* eslint-enable react/jsx-no-bind */
            }
          </Menu>
        </div>
      </div>
    );
  }
}

/* eslint-disable consistent-return */
SearchBar.propTypes = {
  model: React.PropTypes.object.isRequired,
  category: React.PropTypes.oneOf(['authors', 'articles']).isRequired,
  fields: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  fullWidth: React.PropTypes.bool,
  length: React.PropTypes.number.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  showPubDate: React.PropTypes.bool,
  debounceTime: React.PropTypes.number,
  disabled: React.PropTypes.any,
  enableAdd: React.PropTypes.bool,
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
