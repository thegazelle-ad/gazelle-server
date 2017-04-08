import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { debounce, slugifyAuthor } from 'lib/utilities';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

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
      inputName: "",
      inputSlug: "",
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

  handleCreateAuthorChange() {
    const validFlag = this.state.inputSlug && this.state.inputName;
    if (validFlag !== this.state.createAuthorValid) {
      this.safeSetState({createAuthorValid: validFlag});
    }
  }

  createAuthor(e) {
    e.preventDefault();
    const slug = this.state.inputSlug;
    const name = this.state.inputName;

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
          browserHistory.push('/authors/' + slug);
        }
        this.falcorCall(['authorsBySlug', 'createAuthor'], [{slug: slug, name: name}],
          undefined, undefined, undefined, callback);
      }
    })
  }

  render() {
    const styles = {
      paper: {
        height: '100%',
        width: '100%',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'left',
        display: 'inline-block',
      },
      tabs: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 15,
      },
      buttons: {
        marginTop: 24,
        marginBottom: 12,
      },
      authorMenu: {
        display: 'inline-block',
        margin: 0,
      },
    };

    if (this.state.ready) {
      return (
        <div>
          <h1>Authors</h1>
          <Divider />
          <Paper style={styles.paper} zDepth={2}>
            <Tabs>
              <Tab label="EDIT" icon={<ModeEdit />}>
                <div style={styles.tabs}>
                  <h2>Edit Author</h2>
                  <Divider />
                  <form onSubmit={(e)=>{e.preventDefault()}}>
                    <TextField
                      hintText="John Appleseed"
                      floatingLabelText="Input Name"
                      value={this.state.slugSearchValue}
                      onChange={this.handleSearchChange}
                    />
                    <br />
                    <Paper
                      style={styles.authorMenu}
                      zDepth={0}
                    >
                      <Menu>
                      {
                        this.state.searchSuggestions.map((author) => {
                          const link = "/authors/" + author.slug;
                          return (
                            <div key={author.slug}>
                              <Link
                                to={link}
                                onClick={() => {
                                  this.safeSetState({slugSearchValue: author.name,
                                  searchSuggestions: []})}
                                }
                              >
                                <MenuItem primaryText={author.name} />
                              </Link>
                            </div>
                          );
                        })
                      }
                      </Menu>
                    </Paper>
                  </form>
                </div>
              </Tab>
              <Tab label="ADD NEW" icon={<PersonAdd />}>
                <div style={styles.tabs}>
                  <h2>Add New Author</h2>
                  <Divider />
                  <form
                    onSubmit={this.createAuthor}
                    onChange={this.handleCreateAuthorChange}
                  >
                    <TextField
                      type="text"
                      name="name"
                      hintText="John Appleseed"
                      floatingLabelText="Input Name"
                      value={this.state.inputName}
                      onChange={e => this.setState({ inputName: e.target.value })}
                    />
                    <br />
                    <TextField
                      type="text"
                      name="slug"
                      hintText="john-appleseed"
                      floatingLabelText="Input URL Slug"
                      value={this.state.inputSlug}
                      onChange={e => this.setState({ inputSlug: e.target.value })}
                    />
                    <br />
                    <RaisedButton
                      label="Create Author"
                      type="submit"
                      disabled={!this.state.createAuthorValid}
                      primary
                      style={styles.buttons}
                    />
                  </form>
                </div>
              </Tab>
            </Tabs>
            <Divider />
          </Paper>
          <Paper style={styles.paper} zDepth={2}>
            {this.props.children}
          </Paper>
          <br />
        </div>
      );
    }
    else {
      return (
        <div className="circular-progress">
          <CircularProgress />
          {this.props.children}
        </div>
      );
    }
  }
}
