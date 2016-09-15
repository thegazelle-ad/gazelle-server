import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import EditAuthorsForm from './EditAuthorsForm';
import { debounce } from 'lib/utilities';

const categories = [
  "Category 1",
  "Category 2",
  "Category 3"
];

export default class EditorArticleController extends FalcorController {
  constructor(props) {
    super(props);
    this.checkFormChanges = this.checkFormChanges.bind(this);
    this.handleAuthorChanges = this.handleAuthorChanges.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleAddAuthor = this.handleAddAuthor.bind(this);
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
    this.safeSetState({
      changed: false,
      saving: false,
      authorsAdded: {},
      authorsDeleted: {},
      changesObject: {
        mainForm: false,
        authors: false
      }
    });

    this.debouncedHandleMainFormChanges = debounce((event) => {
      const formNode = event.target.parentNode;
      const fields = ["category", "issue", "teaser"];
      const falcorData = this.state.data.articlesBySlug[this.props.params.slug];

      const changedFlag = fields.some((field) => {
        let formValue = formNode[field].value;
        if (field === "issue") {
          formValue = parseInt(formValue);
        }
        const falcorValue = falcorData[field];

        if (formValue !== falcorValue) {
          return true;
        }
        return false;
      });

      if (changedFlag !== this.state.changesObject.mainForm) {
        const newChangesObject = Object.assign({}, this.state.changesObject, {mainForm: changedFlag});
        // this.setState is not a synchronous function, so we check with what will become the new changesObject
        this.checkFormChanges(newChangesObject);
        this.safeSetState({
          changesObject: newChangesObject
        });
      }
    }, 500);
  }

  static getFalcorPathSets(params) {
    return [
      ['articlesBySlug', params.slug, ['title', 'issue', 'category', 'teaser']],
      ['articlesBySlug', params.slug, 'authors', {length: 5}, ['slug', 'name']],
      ['latestIssue', 'issueNumber']];
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps);
    this.safeSetState({
      changed: false,
      saving: false,
      authorsAdded: {},
      authorsDeleted: {}
    });
  }

  checkFormChanges(changesObject) {
    const changedFlag = _.some(changesObject, (flag) => {
      // Check if any of the flags are true
      return flag;
    });
    if (changedFlag !== this.state.changed) {
      this.safeSetState({
        changed: changedFlag
      });
    }
  }

  handleAuthorChanges() {
    const authorsAdded = this.state.authorsAdded;
    const authorsDeleted = this.state.authorsDeleted;

    // Checks if any authors were added or any authors were deleted
    let changedFlag = Object.keys(authorsAdded).length > 0 ||
      _.some(authorsDeleted, (flag) => {
        return flag;
    });

    if (changedFlag !== this.state.changesObject.authors) {
      const newChangesObject = Object.assign({}, this.state.changesObject, {authors: changedFlag});
      // this.setState is not a synchronous function, so we check with what will become the new changesObject
      this.checkFormChanges(newChangesObject);
      this.safeSetState({
        changesObject: newChangesObject
      });
    }
  }

  handleSaveChanges(event) {
    event.preventDefault();
    const formNode = event.target;
    // Here is how data can be retrieved when needed for post requests
    // Remember to check if it changed

    // This can also be done with an iterator like in handleFormChanges
    const category = formNode.category.value;
    const issue = formNode.issue.value;
    const teaser = formNode.teaser.value;

    const authorsAdded = this.state.authorsAdded;
    const authorsDeleted = this.state.authorsDeleted;
    // How to retrieve data done

    // Change data asynchronously
    this.safeSetState({
      saving: true
    });
    setTimeout(
      () => {
        Promise.resolve("success").then(() => {
          // Just use falcor to change data here instead of window reload
          this.safeSetState({
            changed: false
          });
          setTimeout(() => {
            window.location.reload();
            this.safeSetState({
              saving: false
            })
          }, 1000);
      });
    }, 2000);
  }

  // Handle state changes coming from editAuthorsForm

  handleAddAuthor(slug, isOriginalAuthor) {
    if (isOriginalAuthor) {
      let newValue = {};
      newValue[slug] = false;
      let newAuthorsDeleted = Object.assign({}, this.state.authorsDeleted, newValue);
      this.safeSetState({
        authorsDeleted: newAuthorsDeleted
      });
    }
    else {
      // TODO: Autocomplete which also includes validating that the authors indeed exist

      // Is this author already added?
      if (!slug || this.state.authorsAdded.hasOwnProperty(slug) || this.state.authorsDeleted.hasOwnProperty(slug)) {
        return;
      }
      let newValue = {};
      // Remember to change value of this to slug or however we end up storing
      newValue[slug] = slug;
      let newAuthorsAdded = Object.assign({}, this.state.authorsAdded, newValue);
      this.safeSetState({
        authorsAdded: newAuthorsAdded
      });
    }
  }

  handleDeleteAuthor(slug, isOriginalAuthor) {
    if (isOriginalAuthor) {
      let newValue = {};
      newValue[slug] = true;
      let newAuthorsDeleted = Object.assign({}, this.state.authorsDeleted, newValue);
      this.safeSetState({
        authorsDeleted: newAuthorsDeleted
      });
    }
    else {
      let copy = Object.assign({}, this.state.authorsAdded);
      delete copy[slug];
      this.safeSetState({
        authorsAdded: copy
      });
    }
  }

  // TODO: Get latest issue from falcor and use that in a dropdown for choosing issue

  // TODO: Disable all fields while saving

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <div><p>No articles match this slug</p></div>;
      }

      const slug = this.props.params.slug;
      const article = this.state.data.articlesBySlug[slug];
      const latestIssueNumber = this.state.data.latestIssue.issueNumber;

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

// The input type="number" behaves badly in Chrome, TODO: change to <select> with "latest" button
      return (
        <div>
          <h2 style={changedStateStyle}>{changedStateMessage}</h2>
          <h3>{article.title}</h3>
          <p>Change the information for the article and press Save Changes to confirm the changes.</p>
          <form className="pure-form pure-form-stacked" onChange={(e) => {e.persist(); this.debouncedHandleMainFormChanges(e)}} onSubmit={this.handleSaveChanges} ref={(ref) => {this.formNode = ref}}>
            Change the Category:
            <select defaultValue={article.category} name="category">
              {categories.map((category) => {
                return <option value={category} key={category}>{category}</option>;
              })}
            </select>
            Change Issue Number:
            <select defaultValue={article.issue} name="issue">
              {
                _.range(latestIssueNumber, 0, -1).map((issue) => {
                  return <option value={issue} key={issue}>{issue.toString() + (issue === latestIssueNumber ? " (latest issue)" : "")}</option>;
                })
              }
            </select>
            Change Teaser:
            {/*TODO: Style this description so initial size is bigger and more approriate (and also responsive)*/}
            <textarea defaultValue={article.teaser} style={{width: "30em", height: "8em", marginBottom: "10px"}} name="teaser" />
            Update Authors:
            <EditAuthorsForm style={{marginBottom: "10px", marginTop: "6px"}} authors={article.authors} onChange={this.handleAuthorChanges} handleAddAuthor={this.handleAddAuthor} handleDeleteAuthor={this.handleDeleteAuthor} authorsDeleted={this.state.authorsDeleted} authorsAdded={this.state.authorsAdded} />
            {/*Be aware you might want to change when the button is disabled later*/}
            <input className={"pure-button pure-button-primary" + (!this.state.changed || this.state.saving ? " pure-button-disabled" : "")} type="submit" value="Save Changes" disabled={!this.state.changed || this.state.saving} />
          </form>
        </div>
      );
    }
    else {
      return <div><p>loading...</p></div>;
    }
  }
}
