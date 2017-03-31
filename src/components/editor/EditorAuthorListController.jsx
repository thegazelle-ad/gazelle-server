import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { debounce, slugifyAuthor } from 'lib/utilities';
import { Link } from 'react-router';
import _ from 'lodash';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

export default class EditorAuthorListController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCreateAuthorChange = this.handleCreateAuthorChange.bind(this);
    this.createAuthor = this.createAuthor.bind(this);
    this.safeSetState({
      slugSearchValue: "",
      searchSuggestions: [],
      createAuthorValid: false,
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
        query = this.state.slugSearchValue;
      }
      if (!(query.trim())) {
        this.safeSetState({searchSuggestions: []});
        return;
      }
      this.props.model.get(['search', 'authors', query, {length: 3}, ['name', 'slug']])
      .then((x) => {
        if (!x) {
          this.safeSetState({searchSuggestions: []});
          return;
        }
        const suggestions = x.json.search.authors[query];
        const suggestionsArray = _.map(suggestions, (value) => {return value});
        this.safeSetState({searchSuggestions: suggestionsArray});
      })
    }, 250, true);
  }
  static getFalcorPathSets() {
    return [];
  }

  handleSearchChange(e) {
    this.debouncedGetSuggestions(e.target.value);
    this.safeSetState({
      slugSearchValue: e.target.value,
    });
  }

  handleCreateAuthorChange(e) {
    const formNode = e.target.parentNode;
    const validFlag = formNode.slug.value && formNode.name.value;
    if (validFlag !== this.state.createAuthorValid) {
      this.safeSetState({createAuthorValid: validFlag});
    }
  }

  createAuthor(e) {
    e.preventDefault();
    const formNode = e.target;
    const slug = formNode.slug.value;
    const name = formNode.name.value;

    if (slug !== slugifyAuthor(slug)) {
      window.alert("Your slug is not in the right format. Our programatically suggested" +
        " substitute is: " + slugifyAuthor(slug) + ". Feel free to use it or change it to something else");
      return;
    }

    // Check if the slug is already taken
    this.props.model.get(['authorsBySlug', slug, 'slug']).then((x) => {
      if (x) {
        // Something was found, which means the slug is taken
        window.alert("This slug is already taken, please change to another one");
        return;
      }
      else {
        // Create the author
        const callback = () => {
          window.alert("Author added successfully");
        }
        this.falcorCall(['authorsBySlug', 'createAuthor'], [{slug: slug, name: name}],
          undefined, undefined, undefined, callback);
      }
    })
  }

  render() {
    const style = {
      height: '100%',
      width: '100%',
      marginTop: 20,
      marginBottom: 20,
      textAlign: 'center',
      display: 'inline-block',
    };

    if (this.state.ready) {
      return (
        <div>
          <h1>Authors</h1>
          <Divider />
          <Paper style={style} zDepth={2}>
            <p>You can search for authors by name to edit here</p>
            <form onSubmit={(e)=>{e.preventDefault()}}>
              <input type="text" value={this.state.slugSearchValue} placeholder="Input Name" onChange={this.handleSearchChange} />
              {
                this.state.searchSuggestions.map((author) => {
                  const link = "/authors/" + author.slug;
                  return (
                    <div key={author.slug}>
                      <Link to={link} onClick={() => {this.safeSetState({slugSearchValue: "", searchSuggestions: []})}}>
                        <button type="button" className="pure-button">{author.name}</button>
                      </Link>
                    </div>
                  );
                })
              }
            </form>
            <h4>Create New Author</h4>
            <form
              onSubmit={this.createAuthor}
              onChange={this.handleCreateAuthorChange}
            >
              Name:
              <input
                type="text"
                placeholder="Input Name"
                name="name"
              />
              Slug:
              <input
                type="text"
                placeholder="Input Slug"
                name="slug"
              />
              <input
                type="submit"
                className="pure-button pure-button-primary"
                disabled={!this.state.createAuthorValid}
                value="Create Author"
              />
            </form>
          </Paper>
          <div className="pure-u-1-2">
            {this.props.children}
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <CircularProgress />
          {this.props.children}
        </div>
      );
    }
  }
}
