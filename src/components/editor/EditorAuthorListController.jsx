import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { slugifyAuthor } from 'lib/utilities';
import { browserHistory } from 'react-router';
import EditorSearchBar from './EditorSearchBar';
import { updateFieldValue } from './lib/form-field-updaters';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ModeEdit from 'material-ui/svg-icons/editor/mode-edit';

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

export default class EditorAuthorListController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleCreateAuthorChange = this.handleCreateAuthorChange.bind(this);
    this.createAuthor = this.createAuthor.bind(this);
    this.fieldUpdaters = {
      inputName: updateFieldValue.bind(this, 'inputName', undefined),
      inputSlug: updateFieldValue.bind(this, 'inputSlug', undefined),
    };
    this.safeSetState({
      createAuthorValid: false,
      inputName: '',
      inputSlug: '',
    });
  }

  static getFalcorPathSets() {
    return [];
  }

  handleClickAuthor(author) {
    browserHistory.push(`/authors/${author.slug}#author-profile`);
  }

  handleCreateAuthorChange() {
    const validFlag = this.state.inputSlug && this.state.inputName;
    if (validFlag !== this.state.createAuthorValid) {
      this.safeSetState({ createAuthorValid: validFlag });
    }
  }

  createAuthor(e) {
    e.preventDefault();
    const slug = this.state.inputSlug;
    const name = this.state.inputName;

    if (slug !== slugifyAuthor(slug)) {
      window.alert(
        'Your slug is not in the right format. Our programatically suggested ' +
        `substitute is: ${slugifyAuthor(slug)}. ` +
        'Feel free to use it or change it to something else'
      );
      return;
    }

    // Check if the slug is already taken
    this.props.model.get(['authors', 'bySlug', slug, 'slug']).then((x) => {
      if (x) {
        // Something was found, which means the slug is taken
        window.alert('This slug is already taken, please change to another one');
        return;
      }
      // Create the author
      const callback = () => {
        window.alert('Author added successfully');
        browserHistory.push(`/authors/${slug}`);
      };
      this.falcorCall(['authors', 'bySlug', 'createAuthor'], [{ slug, name }],
        undefined, undefined, undefined, callback);
    });
  }

  render() {
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
                  <EditorSearchBar
                    model={this.props.model}
                    mode="authors"
                    fields={['slug']}
                    length={3}
                    handleClick={this.handleClickAuthor}
                  />
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
                      onChange={this.fieldUpdaters.inputName}
                    />
                    <br />
                    <TextField
                      type="text"
                      name="slug"
                      hintText="john-appleseed"
                      floatingLabelText="Input URL Slug"
                      value={this.state.inputSlug}
                      onChange={this.fieldUpdaters.inputSlug}
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
    return (
      <div className="circular-progress">
        <CircularProgress />
        {this.props.children}
      </div>
    );
  }
}
