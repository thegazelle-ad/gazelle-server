import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { debounce, markdownLength } from 'lib/utilities';
import _ from 'lodash';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const MAX_BIOGRAPHY_LENGTH = 400;

export default class EditorAuthorController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleBiographyChanges = this.handleBiographyChanges.bind(this);
    this.safeSetState({
      changed: false,
      saving: false,
      name: '',
      slug: '',
      job_title: '',
      image: '',
      biography: '',
    })

    this.debouncedHandleFormStateChanges = debounce( () => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving) return;

      const changedFlag = this.isFormChanged();
      if (changedFlag !== this.state.changed) {
        this.safeSetState({changed: changedFlag});
      }
    }, 500);

    this.debouncedHandleFormChanges = debounce((event) => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving) return;

      const formNode = event.target.parentNode;

      // Gets all the input elements that we named
      const children = _.map(formNode.children, (child) => {
        return child.name;
      })
      const fields = children.filter((key) => {
        return key && isNaN(parseInt(key)) && key !== "length";
      });

      const falcorData = this.state.data.authorsBySlug[this.props.params.slug];

      const changedFlag = fields.some((field) => {
        const formValue = formNode[field].value;
        const falcorValue = falcorData[field];

        // The last boolean check here checks if both values are falsey
        // like null and empty string, in that case we'll say there's no change
        if ((formValue !== falcorValue) && !(!formValue && !falcorValue)) {
          return true;
        }
        return false;
      });

      if (changedFlag !== this.state.changed) {
        this.safeSetState({changed: changedFlag});
      }
    }, 0);
  }
  static getFalcorPathSets(params) {
    return [
      ['authorsBySlug', params.slug, ['name', 'image', 'biography', 'slug', 'job_title']],
    ];
  }

  componentWillMount() {
    const falcorCallback = (data) => {
      let name = data.authorsBySlug[this.props.params.slug].name;
      let slug = data.authorsBySlug[this.props.params.slug].slug;
      let image = data.authorsBySlug[this.props.params.slug].image;
      let job_title = data.authorsBySlug[this.props.params.slug].job_title;
      let biography = data.authorsBySlug[this.props.params.slug].biography;

      if (!name) { name = ""; }
      if (!slug) { slug = ""; }
      if (!image) { image = ""; }
      if (!job_title) { job_title = ""; }
      if (!biography) { biography = ""; }

      this.safeSetState({
        name: name,
        slug: slug,
        image: image,
        job_title: job_title,
        biography: biography,
      });
    }
    super.componentWillMount(falcorCallback);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallback = (data) => {

      let name = data.authorsBySlug[this.props.params.slug].name;
      let slug = data.authorsBySlug[this.props.params.slug].slug;
      let image = data.authorsBySlug[this.props.params.slug].image;
      let job_title = data.authorsBySlug[this.props.params.slug].job_title;
      let biography = data.authorsBySlug[this.props.params.slug].biography;

      if (!name) { name = ""; }
      if (!slug) { slug = ""; }
      if (!image) { image = ""; }
      if (!job_title) { job_title = ""; }
      if (!biography) { biography = ""; }

      this.safeSetState({
        name: name,
        slug: slug,
        image: image,
        job_title: job_title,
        biography: biography,
      });
    }
    super.componentWillReceiveProps(nextProps, undefined, falcorCallback);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  handleSaveChanges(event) {
    event.preventDefault();

    const falcorData = this.state.data.authorsBySlug[this.props.params.slug];
    const authorSlug = this.props.params.slug

    if (!this.isFormChanged()) {
      throw new Error("Tried to save changes but there were no changes. \
the save changes button is supposed to be disabled in this case");
    }

    // Modularize the code since we'll be reusing it for checking the slug
    const resetState = () => {
      this.safeSetState({
        changed: false,
      });
      // This is purely so the 'saved' message can be seen by the user for a second
      setTimeout(() => {this.safeSetState({saving: false})}, 1000);
    }

    const update = () => {
      // Build the jsonGraphEnvelope
      const jsonGraphEnvelope = {
        paths: [
          ['authorsBySlug', authorSlug, ['name', 'slug', 'job_title', 'image', 'biography']],
        ],
        jsonGraph: {
          authorsBySlug: {
            [authorSlug]: {},
          },
        },
      };

      // Fill in the data
      jsonGraphEnvelope.jsonGraph.authorsBySlug[authorSlug]['name'] = this.state.name;
      jsonGraphEnvelope.jsonGraph.authorsBySlug[authorSlug]['slug'] = this.state.slug;
      jsonGraphEnvelope.jsonGraph.authorsBySlug[authorSlug]['job_title'] = this.state.job_title;
      jsonGraphEnvelope.jsonGraph.authorsBySlug[authorSlug]['image'] = this.state.image;
      jsonGraphEnvelope.jsonGraph.authorsBySlug[authorSlug]['biography'] = this.state.biography;

      // Update the values
      this.falcorUpdate(jsonGraphEnvelope, undefined, resetState);
    }

    if (this.isFormFieldChanged(this.state.slug, falcorData.slug)) {
      if (!window.confirm("You are about to change the slug of an author, this means" +
        " that the url to their webpage will change among other things, it is strongly recommended" +
        " not to change the slug unless it's very crucial. Are you sure you wish to proceed?")) {
        return;
      }
      // Start the saving
      this.safeSetState({saving: true});

      // Make sure this slug is not already taken since we operate with unique slugs
      this.props.model.get(['authorsBySlug', this.state.slug, 'slug']).then((x) => {
        if (x) {
          // This slug is already taken as something was returned
          window.alert("The slug you chose is already taken, please change it");
          this.safeSetState({saving: false});
          return;
        }
        else {
          // Nothing was found which means we can proceed with assigning this slug
          // without problems
          update();
        }
      })
    }
    else {
      // Slug isn't being updated so we can freely update
      // Start the saving
      this.safeSetState({saving: true});
      update();
    }
  }

  handleBiographyChanges() {
    let bio = this.state.biography;
    if (markdownLength(bio) > MAX_BIOGRAPHY_LENGTH) {
      bio = bio.substr(0, MAX_BIOGRAPHY_LENGTH); // Shorten to enforce length limits
      this.safeSetState({ biography: bio });
    }
  }

  isFormFieldChanged (userInput, falcorData) {
    return ((userInput !== falcorData) && !(!userInput && !falcorData));
  }

  isFormChanged () {
    const falcorData = this.state.data.authorsBySlug[this.props.params.slug];
    const changedFlag =
      this.isFormFieldChanged(this.state.name, falcorData.name) ||
      this.isFormFieldChanged(this.state.slug, falcorData.slug) ||
      this.isFormFieldChanged(this.state.job_title, falcorData.job_title) ||
      this.isFormFieldChanged(this.state.image, falcorData.image) ||
      this.isFormFieldChanged(this.state.biography, falcorData.biography);
    return changedFlag;
  }

  render() {
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
    }
    if (this.state.ready) {
      if (!this.state.data) {
        return <div><p>No authors match the slug given in the URL</p></div>;
      }

      let changedStateMessage;
      if (!this.state.changed) {
        if (!this.state.saving) {
          changedStateMessage = "No Changes";
        }
        else {
          changedStateMessage = "Saved";
        }
      }
      else {
        if (!this.state.saving) {
          changedStateMessage = "Save Changes";
        }
        else {
          changedStateMessage = "Saving"
        }
      }

      return (
        <div style={styles.authorProfile}>
          <h3>Author Profile: {this.state.name}</h3>
          <Divider />
          <form onSubmit={this.handleSaveChanges}>
            <TextField
              value={this.state.name}
              floatingLabelText="Name"
              disabled={this.state.saving}
              onChange={e =>
                this.setState({ name: e.target.value }, () => {
                    this.debouncedHandleFormStateChanges();})}
            /><br />
            <TextField
              value={this.state.slug}
              floatingLabelText="Slug"
              disabled={this.state.saving}
              onChange={e =>
                this.setState({ slug: e.target.value }, () => {
                    this.debouncedHandleFormStateChanges();})}
            /><br />
            <TextField
              value={this.state.job_title}
              floatingLabelText="Job Title"
              disabled={this.state.saving}
              onChange={e =>
                this.setState({ job_title: e.target.value }, () => {
                    this.debouncedHandleFormStateChanges();})}
            /><br />
            <TextField
              name="image"
              value={this.state.image}
              floatingLabelText="Image (Remember to use https:// not http://)"
              disabled={this.state.saving}
              onChange={e =>
                this.setState({ image: e.target.value }, () => {
                    this.debouncedHandleFormStateChanges();})}
              fullWidth
            /><br />
            <TextField
              name="biography"
              floatingLabelText={"Biography (" + markdownLength(this.state.biography) +
                " of " + MAX_BIOGRAPHY_LENGTH + " characters)"}
              value={this.state.biography}
              disabled={this.state.saving}
              onChange={e =>
                this.setState({ biography: e.target.value }, () => {
                    this.debouncedHandleFormStateChanges();
                    this.handleBiographyChanges();
                  })}
              multiLine
              rows={2}
              fullWidth
            /><br />
            <RaisedButton
              label={changedStateMessage}
              primary
              style={styles.buttons}
              disabled={!this.state.changed || this.state.saving}
            />
          </form>
        </div>
      );
    }
    else {
      return (<CircularProgress />);
    }
  }
}
