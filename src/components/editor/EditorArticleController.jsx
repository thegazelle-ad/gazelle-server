import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import EditAuthorsForm from './EditAuthorsForm';
import { debounce } from 'lib/utilities';
import update from 'react-addons-update';

const MAX_TEASER_LENGTH = 156;

export default class EditorArticleController extends FalcorController {
  constructor(props) {
    super(props);
    this.checkFormChanges = this.checkFormChanges.bind(this);
    this.handleAuthorChanges = this.handleAuthorChanges.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleAddAuthor = this.handleAddAuthor.bind(this);
    this.handleDeleteAuthor = this.handleDeleteAuthor.bind(this);
    this.handleTeaserChanges = this.handleTeaserChanges.bind(this);
    this.unpublish = this.unpublish.bind(this);
    this.safeSetState({
      changed: false,
      saving: false,
      authorsAdded: [],
      authorsDeleted: {},
      changesObject: {
        mainForm: false,
        authors: false,
      },
      teaser: "",
    });

    this.debouncedHandleMainFormChanges = debounce((event) => {
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

      const falcorData = this.state.data.articlesBySlug[this.props.params.slug];

      let changedFlag = fields.some((field) => {
        const formValue = formNode[field].value;
        const falcorValue = falcorData[field];

        // The last boolean check here checks if both values are falsey
        // like null and empty string, in that case we'll say there's no change
        return formValue !== falcorValue && !(!formValue && !falcorValue);
      });

      if (changedFlag !== this.state.changesObject.mainForm) {
        const newChangesObject = update(this.state.changesObject, {mainForm: {$set: changedFlag}});
        // this.setState is not a synchronous function, so we check with what will become the new changesObject
        this.checkFormChanges(newChangesObject);
        this.safeSetState({
          changesObject: newChangesObject,
        });
      }
    }, 500);
  }

  static getFalcorPathSets(params) {
    return [
      ['articlesBySlug', params.slug, ['title', 'category', 'teaser', 'image', 'id', 'published_at']],
      ['articlesBySlug', params.slug, 'authors', {length: 10}, ['id', 'name']],
      ['categoriesByIndex', {length: 30}, ['name', 'slug']],
    ];
  }

  componentWillMount() {
    const falcorCallback = (data) => {
      let teaser = data.articlesBySlug[this.props.params.slug].teaser;
      if (!teaser) {
        teaser = "";
      }
      this.safeSetState({
        teaser: teaser,
      });
    }
    super.componentWillMount(falcorCallback);
  }
  componentWillReceiveProps(nextProps) {
    const falcorCallback = (data) => {
      let teaser = data.articlesBySlug[this.props.params.slug].teaser;
      if (!teaser) {
        teaser = "";
      }
      this.safeSetState({
        teaser: teaser,
      });
    }
    super.componentWillReceiveProps(nextProps, undefined, falcorCallback);
    this.safeSetState({
      changed: false,
      saving: false,
      authorsAdded: [],
      authorsDeleted: {},
      changesObject: {
        mainForm: false,
        authors: false,
      },
    });
  }

  checkFormChanges(changesObject) {
    const changedFlag = _.some(changesObject, (flag) => {
      // Check if any of the flags are true
      return flag;
    });
    if (changedFlag !== this.state.changed) {
      this.safeSetState({
        changed: changedFlag,
      });
    }
  }

  handleAuthorChanges() {
    const authorsAdded = this.state.authorsAdded;
    const authorsDeleted = this.state.authorsDeleted;

    // Checks if any authors were added or any authors were deleted
    let changedFlag = authorsAdded.length > 0 ||
      _.some(authorsDeleted, (flag) => {return flag});

    if (changedFlag !== this.state.changesObject.authors) {
      const newChangesObject = update(this.state.changesObject, {authors: {$set: changedFlag}});
      // this.setState is not a synchronous function, so we check with what will become the new changesObject
      this.checkFormChanges(newChangesObject);
      this.safeSetState({
        changesObject: newChangesObject,
      });
    }
  }

  handleSaveChanges(event) {
    event.preventDefault();

    const formNode = event.target;
    const articleSlug = this.props.params.slug;
    const falcorData = this.state.data.articlesBySlug[articleSlug];
    const children = _.map(formNode.children, (child) => {
      return child.name;
    })
    const mainFormFields = children.filter((key) => {
      return key && isNaN(parseInt(key)) && key !== "length";
    });

    // Check if we are editing authors
    const authorsAdded = this.state.authorsAdded.length > 0;
    const authorsDeleted = _.some(this.state.authorsDeleted, (flag) => {
      return flag;
    });

    let newAuthors = null;
    if (authorsAdded || authorsDeleted) {
      // Construct the new authors array
      const authorsDeletedDict = this.state.authorsDeleted;
      newAuthors = _.filter((falcorData.authors), (author) => {
        // Check that they were not deleted
        return !authorsDeletedDict[author.id];
      });
      // Add the newly added authors
      newAuthors = newAuthors.concat(this.state.authorsAdded);
      // We only want the slugs
      newAuthors = newAuthors.map((author) => {return author.id});

      // Check that all authors are unique
      if (_.uniq(newAuthors).length !== newAuthors.length) {
        window.alert("You have duplicate authors, as this shouldn't be able" +
          " to happen, please contact developers. And if you know all the actions" +
          " you did previously to this and can reproduce them that would be of great help." +
          " The save has been cancelled");
        return;
      }
      if (newAuthors.length === 0) {
        window.alert("Sorry, because of some non-trivial issues we currently don't have" +
          " deleting every single author implemented. You hopefully shouldn't need this function" +
          " either. Please re-add an author to be able to save");
        return;
      }
    }

    // Check the special case of someone trying to reassign a category as none
    if (formNode.category.value === "none" && falcorData.category !== "none") {
      window.alert("Save cancelled, you cannot reset a category to none." +
        " If you wish to have this feature added, speak to the developers");
      return;
    }

    if (formNode.image.length > 4 && formNode.image.substr(0, 5) !== "https") {
      if (!window.confirm("You are saving an image without using https. " +
        "This can be correct in a few cases but is mostly not. Are you sure " +
        " you wish to continue saving?")) {
        return;
      }
    }

    // Filter fields that didn't change

    const filteredFields = mainFormFields.filter((field) => {
      const formValue = formNode[field].value;
      const falcorValue = falcorData[field];

      return formValue !== falcorValue && !(!formValue && !falcorValue);
    });

    // Determine number of updates to be called
    const updatesToBeCalled = Number(filteredFields.length > 0) +
    Number(newAuthors !== null);

    if (updatesToBeCalled === 0) {
      throw new Error("Tried to save changes but there were no changes. \
the save changes button is supposed to be disabled in this case");
    }

    // Function to be called when all updates are done
    const resetState = () => {
      this.safeSetState({
        changed: false,
        authorsAdded: [],
        authorsDeleted: {},
        changesObject: {mainForm: false, authors: false},
      })
      // This is purely so the 'saved' message can be seen by the user for a second
      setTimeout(() => {this.safeSetState({saving: false})}, 1000);
    }

    // Call necessary updates
    let updatesDone = 0;
    this.safeSetState({saving: true});
    if (filteredFields.length > 0) {
      // Build the jsonGraphEnvelope
      const jsonGraphEnvelope = {
        paths: [
          ['articlesBySlug', articleSlug, filteredFields],
        ],
        jsonGraph: {
          articlesBySlug: {
            [articleSlug]: {},
          },
        },
      };

      filteredFields.forEach((field) => {
        const formValue = formNode[field].value;
        jsonGraphEnvelope.jsonGraph.articlesBySlug[articleSlug][field] = formValue;
      });
      // Update the values
      this.falcorUpdate(jsonGraphEnvelope, undefined, () => {
        updatesDone++;
        if (updatesDone === updatesToBeCalled) {
          resetState();
          /* We can get rid of this hacky solution as right now we just do a full falcor fetch */
          // if (authorsToDelete.length > 0) {
          //   // This is temporary until we find a good way to remove invalidated paths from the
          //   // this.falcorCall function itself. It is very bad and should definitely be improved
          //   setTimeout(() => {
          //     const dataCopy = Object.assign({}, this.state.data);
          //     authorsToDelete.forEach((id) => {
          //       let index = -1;
          //       _.find(dataCopy.articlesBySlug[articleSlug].authors, (value, key) => {
          //         if (value.id === id) {
          //           index = parseInt(key);
          //           return true;
          //         }
          //         return false;
          //       });
          //       if (index !== -1) {
          //         // The author wasn't overwritten by the setState call
          //         delete dataCopy.articlesBySlug[articleSlug].authors[index];
          //       }
          //     });
          //     this.safeSetState({data: dataCopy});
          //   }, 200);
          // }
        }
      });
    }
    if (newAuthors !== null) {
      this.falcorCall(['articlesBySlug', articleSlug, 'authors', 'updateAuthors'], [falcorData.id, newAuthors],
      [['name'], ['slug']], undefined, undefined, () => {
        updatesDone++;
        if (updatesDone === updatesToBeCalled) {
          resetState();
          /* We can get rid of this hacky solution as right now we just do a full falcor fetch */
          // if (authorsToDelete.length > 0) {
          //   // This is temporary until we find a good way to remove invalidated paths from the
          //   // this.falcorCall function itself. It is very bad and should definitely be improved
          //   setTimeout(() => {
          //     const dataCopy = Object.assign({}, this.state.data);
          //     authorsToDelete.forEach((slug) => {
          //       let index = -1;
          //       _.find(dataCopy.articlesBySlug[articleSlug].authors, (value, key) => {
          //         if (value.slug === slug) {
          //           index = parseInt(key);
          //           return true;
          //         }
          //         return false;
          //       });
          //       if (index !== -1) {
          //         // The author wasn't overwritten by the setState call
          //         delete dataCopy.articlesBySlug[articleSlug].authors[index];
          //       }
          //     });
          //     this.safeSetState({data: dataCopy});
          //   }, 200);
          // }
        }
      });
    }
  }

  // Handle state changes coming from editAuthorsForm

  handleAddAuthor(id, name, isOriginalAuthor) {
    // disable this if saving
    if (this.state.saving) return;
    if (isOriginalAuthor) {
      const newAuthorsDeleted = update(this.state.authorsDeleted, {[id]: {$set: false}});
      this.safeSetState({
        authorsDeleted: newAuthorsDeleted,
      });
    }
    else {
      const authors = this.state.data.articlesBySlug[this.props.params.slug].authors;
      // Is this author already added?
      const inAuthorsAdded = this.state.authorsAdded.find((author) => {
        return author.id === id;
      }) !== undefined;
      const inOriginalAuthors = _.find(authors, (author) => {
        return author.id === id;
      }) !== undefined;
      if (inAuthorsAdded || inOriginalAuthors) {
        window.alert("That author is already added");
        return;
      }
      const newAuthorsAdded = update(this.state.authorsAdded, {$push: [{id: id, name: name}]});
      this.safeSetState({
        authorsAdded: newAuthorsAdded,
      });
    }
  }

  handleDeleteAuthor(id, isOriginalAuthor) {
    // disabled this if saving
    if (this.state.saving) return;
    if (isOriginalAuthor) {
      let newValue = {};
      newValue[id] = true;
      let newAuthorsDeleted = Object.assign({}, this.state.authorsDeleted, newValue);
      this.safeSetState({
        authorsDeleted: newAuthorsDeleted,
      });
    }
    else {
      const index = this.state.authorsAdded.findIndex((author) => {
        return author.id === id;
      });
      if (index === -1) {
        throw new Error("The author you are trying to delete cannot be found");
      }
      const newAuthorsAdded = update(this.state.authorsAdded, {$splice: [[index, 1]]});
      this.safeSetState({
        authorsAdded: newAuthorsAdded,
      });
    }
  }

  handleTeaserChanges(e) {
    let teaser = e.target.value;
    if (teaser.length > MAX_TEASER_LENGTH) {
      teaser = teaser.substr(0, MAX_TEASER_LENGTH);
    }
    this.safeSetState({
      teaser: teaser,
    });
  }

  unpublish() {
    const slug = this.props.params.slug;
    const jsonGraphEnvelope = {
      paths: [
        ['articlesBySlug', slug, 'published_at'],
      ],
      jsonGraph: {
        articlesBySlug: {
          [slug]: {
            published_at: null,
          },
        },
      },
    };
    const callback = () => {
      this.safeSetState({changed: false});
      setTimeout(() => {
        this.safeSetState({saving: false});
      }, 1000);
    }
    this.safeSetState({
      changed: true,
      saving: true,
    });
    this.falcorUpdate(jsonGraphEnvelope, undefined, callback);
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data || !this.state.data.articlesBySlug) {
        return <div><p>No articles match this slug</p></div>;
      }

      const slug = this.props.params.slug;
      const article = this.state.data.articlesBySlug[slug];

      // If it is a new article it won't have any meta data yet
      if (!article.hasOwnProperty("category")) {
        article.category = "none";
      }
      const categories = this.state.data.categoriesByIndex;
      categories["none"] = {name: "none", slug: "none"};

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
          <h3>{article.title}</h3>
          <p>Change the information for the article and press Save Changes to confirm the changes.</p>
          <form
            className="pure-form pure-form-stacked"
            onChange={(e) => {e.persist(); this.debouncedHandleMainFormChanges(e)}}
            onSubmit={this.handleSaveChanges}
          >
            Change the Category:
            <select
              defaultValue={article.category}
              name="category"
              disabled={this.state.saving}
            >
              {_.map(categories, (category) => {
                return <option value={category.slug} key={category.slug}>{category.name}</option>;
              })}
            </select>
            Change Image URL (please use https:// for s3 links and any other appropriate sites):
            <input
              type="text"
              defaultValue={article.image}
              name="image"
              disabled={this.state.saving}
            />
            Change Teaser:<br />
            <span style={{fontSize: "0.95em", fontStyle: "italic"}}>
              {this.state.teaser.length} of {MAX_TEASER_LENGTH} characters
            </span>
            {/*TODO: Style this to make it responsive*/}
            <textarea
              value={this.state.teaser}
              onChange={this.handleTeaserChanges}
              style={{width: "30em", height: "5em", marginBottom: "10px"}}
              name="teaser"
              disabled={this.state.saving}
            />
            Update Authors:
            <EditAuthorsForm
              style={{marginBottom: "10px", marginTop: "6px"}}
              authors={article.authors}
              onChange={this.handleAuthorChanges}
              handleAddAuthor={this.handleAddAuthor}
              handleDeleteAuthor={this.handleDeleteAuthor}
              authorsDeleted={this.state.authorsDeleted}
              authorsAdded={this.state.authorsAdded}
              model={this.props.model}
              disabled={this.state.saving}
            />
            <input className="pure-button pure-button-primary" type="submit" value="Save Changes" disabled={!this.state.changed || this.state.saving} />
          </form>
          {
            article.published_at ?
            "The article was published at " + new Date(article.published_at) :
            "The article has yet to be published. It will be published automatically" +
            " when you publish the issue that contains it."
          } <br />
          <button
            type="button"
            className="pure-button"
            onClick={this.unpublish}
            disabled={!article.published_at}
          >Unpublish</button>
        </div>
      );
    }
    else {
      return <div><p>loading...</p></div>;
    }
  }
}
