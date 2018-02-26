import React from 'react';
import { browserHistory } from 'react-router';
import FalcorController from 'lib/falcor/FalcorController';
import { debounce, markdownLength } from 'lib/utilities';
import { updateFieldValue } from './lib/form-field-updaters';
import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';

// material-ui
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import LoadingOverlay from './LoadingOverlay';

const MAX_BIOGRAPHY_LENGTH = 400;

const styles = {
  authorProfile: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
    paddingTop: 10,
  },
  buttons: {
    marginTop: 12,
    marginBottom: 12,
  },
};

export default class AuthorController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.fieldUpdaters = {
      name: updateFieldValue.bind(this, 'name', undefined),
      slug: updateFieldValue.bind(this, 'slug', undefined),
      jobTitle: updateFieldValue.bind(this, 'jobTitle', undefined),
      image: updateFieldValue.bind(this, 'image', undefined),
      biography: updateFieldValue.bind(this, 'biography', {
        trim: MAX_BIOGRAPHY_LENGTH,
      }),
    };
    this.safeSetState({
      changed: false,
      saving: false,
      name: '',
      slug: '',
      jobTitle: '',
      image: '',
      biography: '',
    });

    this.debouncedHandleFormStateChanges = debounce(() => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving) return;

      const changedFlag = this.isFormChanged();
      if (changedFlag !== this.state.changed) {
        this.safeSetState({ changed: changedFlag });
      }
    }, 500);
  }

  static getFalcorPathSets(params) {
    return [
      ['authors', 'bySlug', params.slug, ['name', 'image', 'biography', 'slug', 'job_title']],
    ];
  }

  componentWillMount() {
    const falcorCallback = (data) => {
      const name = data.authors.bySlug[this.props.params.slug].name || '';
      const slug = data.authors.bySlug[this.props.params.slug].slug || '';
      const image = data.authors.bySlug[this.props.params.slug].image || '';
      const jobTitle = data.authors.bySlug[this.props.params.slug].job_title || '';
      const biography = data.authors.bySlug[this.props.params.slug].biography || '';

      this.safeSetState({
        name,
        slug,
        image,
        jobTitle,
        biography,
      });
    };
    super.componentWillMount(falcorCallback);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallback = (data) => {
      const name = data.authors.bySlug[this.props.params.slug].name || '';
      const slug = data.authors.bySlug[this.props.params.slug].slug || '';
      const image = data.authors.bySlug[this.props.params.slug].image || '';
      const jobTitle = data.authors.bySlug[this.props.params.slug].job_title || '';
      const biography = data.authors.bySlug[this.props.params.slug].biography || '';

      this.safeSetState({
        name,
        slug,
        image,
        jobTitle,
        biography,
      });
    };
    super.componentWillReceiveProps(nextProps, undefined, falcorCallback);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  isSameAuthor(prevProps, props) {
    return prevProps.params.slug === props.params.slug;
  }

  formHasUpdated(prevState, state) {
    return (
      this.isFormFieldChanged(prevState.name, state.name) ||
      this.isFormFieldChanged(prevState.slug, state.slug) ||
      this.isFormFieldChanged(prevState.image, state.image) ||
      this.isFormFieldChanged(prevState.jobTitle, state.jobTitle) ||
      this.isFormFieldChanged(prevState.biography, state.biography)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isSameAuthor(prevProps, this.props) &&
        this.formHasUpdated(prevState, this.state) &&
        this.state.ready) {
      // The update wasn't due to a change in article
      this.debouncedHandleFormStateChanges();
    }
  }

  handleDialogClose() {
    if (this.state.saving) return;

    const path = '/authors';
    browserHistory.push(path);
  }

  handleSaveChanges(event) {
    event.preventDefault();

    const falcorData = this.state.data.authors.bySlug[this.props.params.slug];
    const authorSlug = this.props.params.slug;

    if (!this.isFormChanged()) {
      throw new Error(
        'Tried to save changes but there were no changes. ' +
        'the save changes button is supposed to be disabled in this case'
      );
    }

    // Modularize the code since we'll be reusing it for checking the slug
    const resetState = () => {
      this.safeSetState({
        changed: false,
      });
      // This is purely so the 'saved' message can be seen by the user for a second
      setTimeout(() => { this.safeSetState({ saving: false }); }, 1000);
    };

    const update = () => {
      // Build the jsonGraphEnvelope
      const jsonGraphEnvelope = {
        paths: [
          ['authors', 'bySlug', authorSlug, ['name', 'slug', 'job_title', 'image', 'biography']],
        ],
        jsonGraph: {
          authors: {
            bySlug: {
              [authorSlug]: {},
            },
          },
        },
      };

      // Fill in the data
      jsonGraphEnvelope.jsonGraph.authors.bySlug[authorSlug].name = this.state.name;
      jsonGraphEnvelope.jsonGraph.authors.bySlug[authorSlug].slug = this.state.slug;
      jsonGraphEnvelope.jsonGraph.authors.bySlug[authorSlug].job_title = this.state.jobTitle;
      jsonGraphEnvelope.jsonGraph.authors.bySlug[authorSlug].image = this.state.image;
      jsonGraphEnvelope.jsonGraph.authors.bySlug[authorSlug].biography = this.state.biography;

      // Update the values
      this.falcorUpdate(jsonGraphEnvelope, undefined, resetState);
    };

    if (this.isFormFieldChanged(this.state.slug, falcorData.slug)) {
      if (!window.confirm(
        'You are about to change the slug of an author, this means that the url to ' +
        'their webpage will change among other things, it is strongly recommended ' +
        " not to change the slug unless it's very crucial. Are you sure you wish to proceed?"
      )) {
        return;
      }
      // Start the saving
      this.safeSetState({ saving: true });

      // Make sure this slug is not already taken since we operate with unique slugs
      this.props.model.get(['authors', 'bySlug', this.state.slug, 'slug']).then((x) => {
        if (x) {
          x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
          // This slug is already taken as something was returned
          window.alert('The slug you chose is already taken, please change it');
          this.safeSetState({ saving: false });
          return;
        }
        // Nothing was found which means we can proceed with assigning this slug
        // without problems
        update();
      });
    } else {
      // Slug isn't being updated so we can freely update
      // Start the saving
      this.safeSetState({ saving: true });
      update();
    }
  }

  isFormFieldChanged(userInput, falcorData) {
    return ((userInput !== falcorData) && !(!userInput && !falcorData));
  }

  isFormChanged() {
    const falcorData = this.state.data.authors.bySlug[this.props.params.slug];
    const changedFlag =
      this.isFormFieldChanged(this.state.name, falcorData.name) ||
      this.isFormFieldChanged(this.state.slug, falcorData.slug) ||
      this.isFormFieldChanged(this.state.jobTitle, falcorData.job_title) ||
      this.isFormFieldChanged(this.state.image, falcorData.image) ||
      this.isFormFieldChanged(this.state.biography, falcorData.biography);
    return changedFlag;
  }

  render() {
    const ID = 'author-editor';
    if (this.state.ready) {
      if (!this.state.data) {
        return <div id={ID}><p>No authors match the slug given in the URL</p></div>;
      }

      let changedStateMessage;
      if (!this.state.changed) {
        if (!this.state.saving) {
          changedStateMessage = 'No Changes';
        } else {
          changedStateMessage = 'Saved';
        }
      } else {
        if (!this.state.saving) {
          changedStateMessage = 'Save Changes';
        } else {
          changedStateMessage = 'Saving';
        }
      }

      return (
        <Dialog
          title="Author Profile"
          open
          autoScrollBodyContent
          onRequestClose={this.handleDialogClose}
        >
          {this.state.saving ? <LoadingOverlay /> : null}
          <div id={ID} style={styles.authorProfile}>
            <h3>Author Profile: {this.state.name}</h3>
            <Divider />
            <form onSubmit={this.handleSaveChanges}>
              <TextField
                value={this.state.name}
                floatingLabelText="Name"
                disabled={this.state.saving}
                onChange={this.fieldUpdaters.name}
              /><br />
              <TextField
                value={this.state.slug}
                floatingLabelText="Slug"
                disabled={this.state.saving}
                onChange={this.fieldUpdaters.slug}
              /><br />
              <TextField
                value={this.state.jobTitle}
                floatingLabelText="Job Title"
                disabled={this.state.saving}
                onChange={this.fieldUpdaters.jobTitle}
              /><br />
              <TextField
                name="image"
                value={this.state.image}
                floatingLabelText="Image (Remember to use https:// not http://)"
                disabled={this.state.saving}
                onChange={this.fieldUpdaters.image}
                fullWidth
              /><br />
              <TextField
                name="biography"
                floatingLabelText={
                  `Biography (${markdownLength(this.state.biography)} ` +
                  `of ${MAX_BIOGRAPHY_LENGTH} characters)`
                }
                value={this.state.biography}
                disabled={this.state.saving}
                onChange={this.fieldUpdaters.biography}
                multiLine
                rows={2}
                fullWidth
              /><br />
              <RaisedButton
                label={changedStateMessage}
                type="submit"
                primary
                style={styles.buttons}
                disabled={!this.state.changed || this.state.saving}
              />
            </form>
          </div>
        </Dialog>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }
}
