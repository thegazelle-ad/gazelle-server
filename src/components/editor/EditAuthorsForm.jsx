import React from 'react';
import ReactDOM from 'react-dom';
import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';

export default class EditAuthorsForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      addAuthorValue: ""
    });
    this.handleClickAddAuthor = this.handleClickAddAuthor.bind(this);
  }

  componentDidUpdate() {
    this.props.onChange();
  }

  handleClickAddAuthor() {
    this.props.handleAddAuthor(this.state.addAuthorValue, false);
    this.safeSetState({addAuthorValue: ""});
  }

  render() {
    return (
      <div style={this.props.style}>
        {
          _.map(this.props.authors, (author) => {
            // Striked will correctly evaluate to false if there is no key
            // with that slug yet, which means it has neither been striked nor unstriked yet
            // It will return undefined which is a falsy value
            let striked = this.props.authorsDeleted[author.slug];
            let authorNameStyle = {marginLeft: "1em"};
            if (striked) {
              authorNameStyle.textDecoration = "line-through";
              authorNameStyle.opacity = 0.5;
            }

            return(
              <div key={author.slug}>
                {
                  !striked
                    ? <button type="button" className="reset-button-style" style={{float: "left"}} aria-label="Remove Author Button" onClick={this.props.handleDeleteAuthor.bind(null, author.slug, true)}>&times;&nbsp;</button>
                    : <button type="button" className="reset-button-style" style={{float: "left"}} aria-label="Remove Author Button" onClick={this.props.handleAddAuthor.bind(null, author.slug, true)}>~&nbsp;</button>
                }
                <div style={authorNameStyle}>{author.name}</div>
              </div>
            );
          })
        }
        {
          // Key is slug, value is name
          _.map(this.props.authorsAdded, (name, slug) => {
            return(
              <div key={slug}>
                <a style={{float: "left", cursor: "pointer"}} aria-label="Remove Author Button" onClick={this.props.handleDeleteAuthor.bind(null, slug, false)}>&times;&nbsp;</a>
                <div>{name}</div>
              </div>
            );
          })
        }

        <input placeholder="Add Author" value={this.state.addAuthorValue} onChange={(e)=>{e.stopPropagation(); this.safeSetState({addAuthorValue: e.target.value});}} />
        <button className="pure-button" type="button" onClick={this.handleClickAddAuthor}>Add Author</button>
      </div>
    )
  }
}
