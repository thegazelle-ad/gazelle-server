import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';

export default class EditAuthorsForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      // Key is slug, value is name
      authorsAdded: {},
      // An object where key is slug and value is whether it's deleted or not
      authorsDeleted: _.reduce(this.props.data, (cur, next) => {
        cur[next.slug] = false;
        return cur;
      }, {})
    });
    this.handleAddAuthor = this.handleAddAuthor.bind(this);
  }

  componentDidUpdate() {
    this.props.onChange(this.state.authorsAdded, this.state.authorsDeleted);
  }

  handleAddAuthor() {
    // TODO: Autocomplete which also includes validating that the authors indeed exist
    let val = this.addAuthorNode.value;
    // Is this author already added?
    if (!val || this.state.authorsAdded.hasOwnProperty(val) || this.state.authorsDeleted.hasOwnProperty(val)) {
      this.addAuthorNode.value = "";
      return;
    }
    let newValue = {};
    // Remember to change value of this to slug or however we end up storing
    newValue[val] = val;
    let newAuthorsAdded = Object.assign({}, this.state.authorsAdded, newValue);
    this.safeSetState({
      authorsAdded: newAuthorsAdded
    });
    // Clear input field
    this.addAuthorNode.value = "";
  }

  handleDeleteAuthor(slug, originalAuthor) {
    if (originalAuthor) {
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

  handleUnstrikeAuthor(slug) {
    let newValue = {};
    newValue[slug] = false;
    let newAuthorsDeleted = Object.assign({}, this.state.authorsDeleted, newValue);
    this.safeSetState({
      authorsDeleted: newAuthorsDeleted
    });
  }

  render() {
    return (
      <div>
        <input placeholder="Add Author" onChange={(e)=>{e.stopPropagation()}} ref={(ref) => {this.addAuthorNode = ref}} />
        <button className="pure-button" type="button" onClick={this.handleAddAuthor}>Add Author</button>
        {
          _.map(this.props.data, (author) => {
            let striked = this.state.authorsDeleted[author.slug];
            let authorNameStyle = {};
            if (striked) {
              authorNameStyle.textDecoration = "line-through";
            }

            return(
              <div key={author.slug}>
                {
                  !striked
                    ? <a style={{float: "left", cursor: "pointer"}} aria-label="Remove Author Button" onClick={this.handleDeleteAuthor.bind(this, author.slug, true)}>&times;&nbsp;</a>
                    : <a style={{float: "left", cursor: "pointer"}} aria-label="Remove Author Button" onClick={this.handleUnstrikeAuthor.bind(this, author.slug)}>~&nbsp;</a>
                }
                <div style={authorNameStyle}>{author.name}</div>
              </div>
            );
          })
        }
        {
          // Key is slug, value is name
          _.map(this.state.authorsAdded, (name, slug) => {
            return(
              <div key={slug}>
                <a style={{float: "left", cursor: "pointer"}} aria-label="Remove Author Button" onClick={this.handleDeleteAuthor.bind(this, slug, false)}>&times;&nbsp;</a>
                <div>{name}</div>
              </div>
            );
          })
        }
      </div>
    )
  }
}
