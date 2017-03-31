import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { debounce, formatDate } from 'lib/utilities';
import _ from 'lodash';

// material-ui
import TextField from 'material-ui/TextField';

export default class EditorSearchBar extends BaseComponent {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.safeSetState({
      searchValue: "",
      searchSuggestions: [],
    });

    this.debouncedGetSuggestions = debounce((query, wasCalledInstantly = false) => {
      /* Since we provided the instantFlag to the debounced function we have to be careful
      always to provide the query parameter to the function, or the debounce function will
      append true as the query value as it always just appends the argument to the back of the
      provided arguments */
      if (!wasCalledInstantly) {
        // If it wasn't called instantly we get the value from state
        // otherwise we want it directly as setState is asynchronous and
        // won't give the most updated value
        query = this.state.searchValue;
      }
      if (!(query.trim())) {
        this.safeSetState({searchSuggestions: []});
        return;
      }
      let pathSets = [];
      let fields;
      switch(this.props.mode) {
        case "articles":
          // Add required fields
          fields = this.props.fields.concat(['title', 'slug']);
          if (this.props.showPubDate) {
            fields.push('published_at');
          }
          // Remove duplicates
          fields = _.uniq(fields);

          pathSets.push(['search', 'posts', query, {length: this.props.length}, fields]);
          if (this.props.extraPathSets) {
            const extraPathSets = this.props.extraPathSets.map((pathSet) => {
              return ['search', 'posts', query, {length: this.props.length}].concat(pathSet);
            })
            pathSets = pathSets.concat(extraPathSets);
          }
          break;
        case "authors":
          // Add required fields and remove duplicates
          fields = _.uniq(this.props.fields.concat(['name', 'slug']));

          pathSets.push(['search', 'authors', query, {length: this.props.length}, fields]);
          if (this.props.extraPathSets) {
            const extraPathSets = this.props.extraPathSets.map((pathSet) => {
              return ['search', 'authors', query, {length: this.props.length}].concat(pathSet);
            })
            pathSets = pathSets.concat(extraPathSets);
          }
          break;
        default:
          throw new Error("Invalid mode was passed to EditorSearchBar");
      }

      this.props.model.get(...pathSets)
      .then((x) => {
        if (!x) {
          this.safeSetState({searchSuggestions: []});
          return;
        }
        let suggestions = x.json.search;
        if (this.props.mode === "articles") {
          suggestions = suggestions.posts[query];
        }
        else {
          suggestions = suggestions.authors[query];
        }
        const suggestionsArray = _.map(suggestions, (value) => {return value});
        this.safeSetState({searchSuggestions: suggestionsArray});
      })
    }, this.props.debounceTime || 250, true);
  }

  componentWillReceiveProps() {
    this.safeSetState({
      searchValue: "",
      searchSuggestions: [],
    });
  }

  handleSearchChange(e) {
    this.debouncedGetSuggestions(e.target.value);
    this.safeSetState({
      searchValue: e.target.value,
    });
  }

  handleClick(article) {
    this.safeSetState({
      searchValue: "",
      searchSuggestions: [],
    })
    this.props.handleClick(article);
  }

  // <input
  //   type="text"
  //   value={this.state.searchValue}
  //   placeholder={this.props.placeholder || "Input Title"}
  //   onChange={this.handleSearchChange}
  //   style={{marginBottom: "5px"}}
  // />

  render() {
    if (this.props.mode === "articles") {
      return (
        <div>
          <TextField
            hintText="Search for articles"
            fullWidth
            value={this.state.searchValue}
            onChange={this.handleSearchChange}
          />
          <div>
            {
              this.state.searchSuggestions.map((article) => {
                let textShown = article.title;
                if (this.props.showPubDate) {
                  let date;
                  if (article.published_at) {
                    date = formatDate(new Date(article.published_at));
                  }
                  else {
                    date = "Unpublished";
                  }
                  textShown += ' - ' + date;
                }
                return (
                  <div key={article.slug}>
                    {/* eslint-disable react/jsx-no-bind */}
                    <button
                      type="button"
                      className="pure-button"
                      onClick={this.handleClick.bind(this, article)}
                      disabled={this.props.disabled}
                    >{textShown}</button>
                    {/* eslint-enable react/jsx-no-bind */}
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }
    else if (this.props.mode === "authors") {
      return (
        <div >
          <input
            type="text"
            value={this.state.searchValue}
            placeholder={this.props.placeholder || "Input Name"}
            onChange={this.handleSearchChange}
            style={{marginBottom: "5px"}}
          />
          <div>
            {
              this.state.searchSuggestions.map((author) => {
                return (
                  <div key={author.slug}>
                    {/* eslint-disable react/jsx-no-bind */}
                    <button
                      type="button"
                      onClick={this.handleClick.bind(this, author)}
                      disabled={this.props.disabled}
                    >{author.name}</button>
                    {/* eslint-enable react/jsx-no-bind */}
                  </div>
                );
              })
            }
          </div>
        </div>
      );
    }
    else {
      return <div style={{color: "red"}}>Sorry, an error occured, please contact the developers</div>;
    }
  }
}

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
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`. It must be an array of pathSets'
    );
    if (!(prop instanceof Array)) {
      return error;
    }
    else {
      const valid = prop.every((value) => {
        if (!(value instanceof Array)) {
          return false;
        }
        else if (value[0] === "search") {
          error = new Error(
          'Invalid prop `' + propName + '` supplied to' +
          ' `' + componentName + '`. Just add the extension, ' +
          'do not add "search"... as this is already considered'
          );
          return false;
        }
        return true;
      });
      if (!valid) {
        return error;
      }
    }
  },
}
