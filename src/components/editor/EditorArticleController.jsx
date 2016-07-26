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
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.safeSetState({
      changed: "none",
      saving: false
    });
    
    this.debouncedHandleFormChanges = debounce(() => {
      const authorsAdded = this.editAuthorListNode.state.authorsAdded;
      const authorsDeleted = this.editAuthorListNode.state.authorsDeleted;

      let changedFlag = Object.keys(authorsAdded).length > 0 || 
        _.some(authorsDeleted, (val) => {
          return val;
      });
      if (!changedFlag) {
        const formNode = this.formNode;
        const fields = ["category", "issue", "description"];
        const falcorData = this.state.data.articlesBySlug[this.props.params.slug];

        // As changedFlag is currently false, we can simply use equals here
        changedFlag = fields.some((field) => {
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
      }
      const newChangedState = changedFlag ? "changed" : "none";
      if (newChangedState !== this.state.changed) {
        this.safeSetState({
          changed: newChangedState
        });
      }
    }, 500);
  }

  static getFalcorPathSets(params) {
    return [['articlesBySlug', params.slug, ['title', 'issue', 'category', 'description']], ['articlesBySlug', params.slug, 'authors', {to: 2}, ['slug', 'name']], ['latestIssue']];
  }

  handleSaveChanges(event) {
    event.preventDefault();
    const formNode = event.target;
    // Here is how data can be retrieved when needed for post requests
    // Remember to check if it changed

    // This can also be done with an iterator like in handleFormChanges
    const category = formNode.category.value;
    const issue = formNode.issue.value;
    const description = formNode.description.value;

    const authorsAdded = this.editAuthorListNode.state.authorsAdded;
    const authorsDeleted = this.editAuthorListNode.state.authorsDeleted;
    // How to retrieve data done

    // Change data asynchronously
    this.safeSetState({
      changed: "saving"
    });
    setTimeout(
      () => {
        Promise.resolve("success").then(() => {
          // Just use falcor to change data here instead of window reload
          this.safeSetState({
            changed: "saved"
          });
          setTimeout(() => {
            window.location.reload();
          }, 1000);
      });
    }, 2000);
  }

  // TODO: Get latest issue from falcor and use that in a dropdown for choosing issue

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <div><p>No articles match this slug</p></div>;
      }

      const slug = this.props.params.slug;
      const article = this.state.data.articlesBySlug[slug];
      const latestIssue = this.state.data.latestIssue;

      let changedStateMessage;
      const changedStateStyle = {};
      switch (this.state.changed) {
        case "none":
          changedStateMessage = "No Changes";
          break;
        
        case "saving":
          changedStateMessage = "Saving"
          changedStateStyle.color = "#65e765";
          break;

        case "changed":
          changedStateMessage = "Unsaved Changes";
          changedStateStyle.color = "red";
          break;

        case "saved":
          changedStateMessage = "Saved";
          changedStateStyle.color = "green";
          break;

        default:
          throw new Error("this.state.changed = " + this.state.changed + " which is not a possible value");
      }

// The input type="number" behaves badly in Chrome, TODO: change to <select> with "latest" button
      return (
        <div>
          <h2 style={changedStateStyle}>{changedStateMessage}</h2>
          <h3>{article.title}</h3>
          <p>Change the information for the article and press Save Changes to confirm the changes.</p>
          <form className="pure-form pure-form-stacked" onChange={this.debouncedHandleFormChanges} onSubmit={this.handleSaveChanges} ref={(ref) => {this.formNode = ref}}>
            Change the Category:
            <select defaultValue={article.category} name="category">
              {categories.map((category) => {
                return <option value={category} key={category}>{category}</option>;
              })}
            </select>
            Change Issue Number:
            <select defaultValue={article.issue} name="issue">
              {
                _.range(latestIssue, 0, -1).map((issue) => {
                  return <option value={issue} key={issue}>{issue.toString() + (issue === latestIssue ? " (latest issue)" : "")}</option>;
                })
              }
            </select>
            Change Description:
            {/*TODO: Style this description so initial size is bigger and more approriate (and also responsive)*/}
            <textarea defaultValue={article.description} name="description" />
            Edit Authors:
            <EditAuthorsForm data={article.authors} onChange={this.debouncedHandleFormChanges} ref={(ref) => {this.editAuthorListNode = ref}} />
          {/*Be aware you might want to change when the button is disabled later*/}
            <input className={"pure-button pure-button-primary" + (this.state.changed === "changed" ? "" : " pure-button-disabled")} type="submit" value="Save Changes" disabled={this.state.changed !== "changed"} />
          </form>
        </div>
      );
    }
    else {
      return <div><p>loading...</p></div>;
    }
  }
}
