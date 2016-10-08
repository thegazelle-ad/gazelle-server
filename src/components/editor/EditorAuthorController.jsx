import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import { debounce } from 'lib/utilities';
import _ from 'lodash';

const MAX_BIOGRAPHY_LENGTH = 400;

export default class EditorAuthorController extends FalcorController {
  constructor(props) {
    super(props);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleBiographyChanges = this.handleBiographyChanges.bind(this);
    this.safeSetState({
      changed: false,
      saving: false,
      biography: '',
    })

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
      let biography = data.authorsBySlug[this.props.params.slug].biography;
      if (!biography) {
        biography = "";
      }
      this.safeSetState({
        biography: biography,
      });
    }
    super.componentWillMount(falcorCallback);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallback = (data) => {
      let biography = data.authorsBySlug[this.props.params.slug].biography;
      if (!biography) {
        biography = "";
      }
      this.safeSetState({
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
    let biography = e.target.value;
    if (biography.length > MAX_BIOGRAPHY_LENGTH) {
      biography = biography.substr(0, MAX_BIOGRAPHY_LENGTH);
    }
    this.safeSetState({
      biography: biography,
    });
  }

  render() {
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
          changedStateMessage = "Unsaved Changes";
          changedStateStyle.color = "red";
        }
        else {
          changedStateMessage = "Saving"
          changedStateStyle.color = "#65e765";
        }
      }

      return (
        <div>
          <h2 style={changedStateStyle}>{changedStateMessage}</h2>
          <h3>{author.name}</h3>
          <p>Change the information for the author and press Save Changes to confirm the changes.</p>
          <form
            className="pure-form pure-form-stacked"
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
              {this.state.biography.length} of {MAX_BIOGRAPHY_LENGTH} characters
            </span>
            <textarea
              value={this.state.biography}
              onChange={this.handleBiographyChanges}
              style={{width: "30em", height: "8em"}}
              name="biography"
              disabled={this.state.saving}
            />
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
      return <div><p>loading...</p></div>;
    }
  }
}
