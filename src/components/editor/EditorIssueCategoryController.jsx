import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import update from 'react-addons-update';

export default class EditorIssueCategoryController extends FalcorController {
  constructor(props) {
    super(props);
    this.safeSetState({
      changed: false,
      saving: false,
      categories: [],
    });

    this.handleChanges = this.handleChanges.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  static getFalcorPathSets(params) {
    return [
      ['issuesByNumber', params.issueNumber, 'categories', {length: 20}, ['name', 'id']],
      ['issuesByNumber', params.issueNumber, 'name'],
    ];
  }

  componentWillMount() {
    const falcorCallBack = (data) => {
      const issueNumber = this.props.params.issueNumber;
      const categories = data.issuesByNumber[issueNumber].categories;
      const categoriesArray = _.map(categories, (category) => {
        return category;
      });

      this.safeSetState({
        categories: categoriesArray,
      });
    }
    super.componentWillMount(falcorCallBack);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallBack = (data) => {
      const issueNumber = this.props.params.issueNumber;
      const categories = data.issuesByNumber[issueNumber].categories;
      const categoriesArray = _.map(categories, (category) => {
        return category;
      });
      this.safeSetState({
        categories: categoriesArray,
      });
    }
    super.componentWillReceiveProps(nextProps, undefined, falcorCallBack);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  handleChanges(newCategories) {
    const issueNumber = this.props.params.issueNumber;
    const oldCategories = this.state.data.issuesByNumber[issueNumber].categories;
    const changed = newCategories.some((category, index) => {
      return category.id !== oldCategories[index].id;
    });
    if (changed !== this.state.changed) {
      this.safeSetState({changed: changed});
    }
  }

  handleOrderChange(index, event) {
    const newIndex = event.target.value-1;
    const categories = this.state.categories;
    const category = categories[index];
    let newCategories = update(categories, {$splice: [[index, 1], [newIndex, 0, category]]});
    this.handleChanges(newCategories);
    this.safeSetState({
      categories: newCategories,
    });
  }

  handleSave() {
    const issueNumber = this.props.params.issueNumber;
    const oldCategories = this.state.data.issuesByNumber[issueNumber].categories;
    const newCategories = this.state.categories;
    // Shallow validity check
    if (Object.keys(oldCategories).length !== newCategories.length) {
      window.alert("There was an error, there has been added or removed a category" +
        " mysteriously. Please contact developers");
      return;
    }
    const idArray = newCategories.map((category) => {return category.id});

    const callback = (data) => {
      const updatedCategories = _.map(data.issuesByNumber[issueNumber].categories,
        (category) => {return category});
      this.safeSetState({
        changed: false,
        categories: updatedCategories,
      });
      setTimeout(() => {
        this.safeSetState({saving: false});
      }, 1000);
    }
    this.safeSetState({saving: true});
    this.falcorCall(['issuesByNumber', issueNumber, 'updateIssueCategories'],
      [idArray], undefined, undefined, undefined, callback);

  }

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <div>Incorrect issue number provided, this page was not found</div>;
      }
      const issueNumber = this.props.params.issueNumber;
      const data = this.state.data.issuesByNumber[issueNumber];
      const categories = this.state.categories;
      if (!categories || categories.length === 0) {
        return (
          <div>
            <p>
              The issue has no categories as of now. Remember to first add all
              articles you want to be in the issue and then go here to order the categories.
            </p>
          </div>
        );
      }

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
          <h3>{data.name}</h3>
          <p>
            Here you can reorder the categories. Remember that every time you
            change which articles are in the issue, for now the order of the categories
            will be randomized and you will have to come back here and reorder them. <br />
            Also remember that this should be the last step before the issue is published and
            at this point all articles you want in the issue should be already added.
          </p>
          <h4>Categories</h4>
          <div>
            {
              categories.map((category, index) => {
                return (
                  <div
                    key={category.id.toString() + '-' + index.toString()}
                    style={{marginBottom: "8px"}}
                  >
                    {/* eslint-disable react/jsx-no-bind*/}
                    <select
                      onChange={this.handleOrderChange.bind(this, index)}
                      defaultValue={index+1}
                      style={{marginRight: "10px"}}
                      disabled={this.state.saving}
                    >
                    {/* eslint-enable react/jsx-no-bind*/}
                      {
                        _.range(1, categories.length+1).map((order) => {
                          return <option key={order} value={order}>{order}</option>;
                        })
                      }
                    </select>
                    {category.name}
                  </div>
                );
              })
            }
          </div>
          <button
            type="button"
            className="pure-button pure-button-primary"
            onClick={this.handleSave}
            disabled={this.state.saving || !this.state.changed}
          >Save Changes</button>
        </div>
      );
    }
    else {
      return <div>loading...</div>;
    }
  }
}
