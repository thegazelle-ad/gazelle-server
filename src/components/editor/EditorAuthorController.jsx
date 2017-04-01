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

      const falcorData = this.state.data.authorsBySlug[this.props.params.slug];
      const changedFlag =
        this.isChanged(this.state.name, falcorData.name) ||
        this.isChanged(this.state.slug, falcorData.slug) ||
        this.isChanged(this.state.job_title, falcorData.job_title) ||
        this.isChanged(this.state.image, falcorData.image) ||
        this.isChanged(this.state.biography, falcorData.biography);

      if (changedFlag !== this.state.changed) {
        this.safeSetState({changed: changedFlag});
      }
    }, 500);

    this.debouncedHandleFormChanges = debounce((event) => {
      console.log(this.state.name);
      console.log(this.state.slug);
      console.log(this.state.biography);

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
    }, 500);
  }
  static getFalcorPathSets(params) {
    return [
      ['authorsBySlug', params.slug, ['name', 'image', 'biography', 'slug', 'job_title']],
      // ['authorsBySlug', params.slug, 'articles', {length: 100}, 'title'],
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

    const formNode = event.target;

    const name = this.state.name;
    const slug = this.state.slug;
    const job_title = this.state.job_title;
    const image = this.state.image;
    const biography = this.state.biography;

    const authorSlug = this.props.params.slug

    // Gets all the input elements that we named
    const children = _.map(formNode.children, (child) => {
      return child.name;
    })
    const fields = children.filter((key) => {
      return key && isNaN(parseInt(key)) && key !== "length";
    });

    const falcorData = this.state.data.authorsBySlug[authorSlug];
    const filteredFields = fields.filter((field) => {
      const formValue = formNode[field].value;
      const falcorValue = falcorData[field];

      return formValue !== falcorValue && !(!formValue && !falcorValue);
    });

    if (filteredFields.length === 0) {
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
          ['authorsBySlug', authorSlug, filteredFields],
        ],
        jsonGraph: {
          authorsBySlug: {
            [authorSlug]: {},
          },
        },
      };

      filteredFields.forEach((field) => {
        const formValue = formNode[field].value;
        jsonGraphEnvelope.jsonGraph.authorsBySlug[authorSlug][field] = formValue;
      });

      // Update the values
      this.falcorUpdate(jsonGraphEnvelope, undefined, resetState);
    }

    if (filteredFields.find((field) => {return field === 'slug'})) {
      if (!window.confirm("You are about to change the slug of an author, this means" +
        " that the url to their webpage will change among other things, it is recommended" +
        " not to change the slug unless it's very crucial. Are you sure you want to proceed?")) {
        return;
      }
      // Start the saving
      this.safeSetState({saving: true});

      // Make sure this slug is not already taken since we operate with unique slugs
      this.props.model.get(['authorsBySlug', formNode.slug.value, 'slug']).then((x) => {
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

  handleBiographyChanges(e) {
    this.safeSetState({ biography: e.target.value });
    let bio = this.state.biography;
    if (markdownLength(bio) > MAX_BIOGRAPHY_LENGTH) {
      bio = bio.substr(0, MAX_BIOGRAPHY_LENGTH);
      this.safeSetState({ biography: bio });
    }
  }

  isChanged (userInput, falcorData) {
    return ((userInput !== falcorData) && !(!userInput && !falcorData));
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

      const slug = this.props.params.slug;
      const author = this.state.data.authorsBySlug[slug];

      let changedStateMessage;
      const changedStateStyle = {};
      if (!this.state.changed) {
        if (!this.state.saving) {
          changedStateMessage = "No Changes";
        }
        else {
          changedStateMessage = "Saved";
          changedStateStyle.color = "green";
        }
      }
      else {
        if (!this.state.saving) {
          changedStateMessage = "Save Changes";
          changedStateStyle.color = "red";
        }
        else {
          changedStateMessage = "Saving"
          changedStateStyle.color = "#65e765";
        }
      }

      return (
        <div style={styles.authorProfile}>
          <h3>Author Profile: {this.state.name}</h3>
          <Divider />
          <p>Change the information for the author and press Save Changes to confirm the changes.</p>
          <form onSubmit={this.handleSaveChanges}>
            <TextField
              value={this.state.name}
              floatingLabelText="Name"
              disabled={this.state.saving}
              onChange={e => {
                this.safeSetState({ name: e.target.value });
                this.debouncedHandleFormStateChanges();}}
            /><br />
            <TextField
              value={this.state.slug}
              floatingLabelText="Slug"
              disabled={this.state.saving}
              onChange={e => {
                this.safeSetState({ slug: e.target.value });
                this.debouncedHandleFormStateChanges();}}
            /><br />
            <TextField
              value={this.state.job_title}
              floatingLabelText="Job Title"
              disabled={this.state.saving}
              onChange={e => {
                this.safeSetState({ job_title: e.target.value });
                this.debouncedHandleFormStateChanges();}}
            /><br />
            <TextField
              name="image"
              value={this.state.image}
              floatingLabelText="Image (Remember to use https:// not http://)"
              disabled={this.state.saving}
              onChange={e => {
                this.safeSetState({ image: e.target.value });
                this.debouncedHandleFormStateChanges();}}
              fullWidth
            /><br />
            <TextField
              name="biography"
              floatingLabelText={"Biography (" + markdownLength(this.state.biography) +
                " of " + MAX_BIOGRAPHY_LENGTH + " characters)"}
              value={this.state.biography}
              disabled={this.state.saving}
              onChange={this.handleBiographyChanges}
              multiLine
              rows={2}
              rowsMax={5}
              fullWidth
            /><br />
            <RaisedButton
              label={changedStateMessage}
              primary
              style={styles.buttons}
              disabled={!this.state.changed || this.state.saving}
            />
          </form>




          <br />
          <br />
          <br />
          <form
            onChange={(e) => {e.persist(); this.debouncedHandleFormChanges(e)}}
            onSubmit={this.handleSaveChanges}
          >
            Change Name:
            <input
              type="text"
              defaultValue={author.name}
              name="name"
              disabled={this.state.saving}
            />
            Change Slug:
            <input
              type="text"
              defaultValue={author.slug}
              name="slug"
              disabled={this.state.saving}
            />
            Change Job Title:
            <input
              type="text"
              defaultValue={author.job_title}
              name="job_title"
              disabled={this.state.saving}
            />
            Change Image URL (please use https:// for s3 and other secure links):
            <input
              type="text"
              defaultValue={author.image}
              name="image"
              disabled={this.state.saving}
            />
            Change Biography:<br />
            <span style={{fontSize: "0.95em", fontStyle: "italic"}}>
              {markdownLength(this.state.biography)} of {MAX_BIOGRAPHY_LENGTH} characters
            </span>
            <textarea
              value={this.state.biography}
              onChange={this.handleBiographyChanges}
              style={{width: "30em", height: "8em"}}
              name="biography"
              disabled={this.state.saving}
            />
            <p style={changedStateStyle}>{changedStateMessage}</p>
            <input
              className="pure-button pure-button-primary"
              type="submit"
              value="Save Changes"
              disabled={!this.state.changed || this.state.saving}
              style={{marginTop: "8px"}}
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
