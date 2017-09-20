/* eslint react/jsx-no-bind: 0 */

import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import EditorSearchBar from 'components/editor/EditorSearchBar';
import _ from 'lodash';

// material-ui
import Chip from 'material-ui/Chip';

class AuthorChip extends BaseComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.props.onDelete(this.props.id);
  }

  render() {
    return (
      <Chip
        onRequestDelete={this.onClick}
        style={this.props.style}
      >
        {this.props.children}
      </Chip>
    );
  }
}

export default class EditAuthorsForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      addAuthorValue: '',
      authorAutocomplete: [],
    });
    this.handleClickAddAuthor = this.handleClickAddAuthor.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.disabled &&
      this.props.authors !== prevProps.authors) {
      this.props.onChange();
    }
  }

  handleClickAddAuthor(author) {
    this.props


    .handleAddAuthor(author.id, author.name);
  }

  render() {
    const styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    const authorChips = this.props.authors.length > 0 ?
      _.map(this.props.authors, (author) => (
        <AuthorChip
          key={author.id}
          id={author.id}
          onDelete={this.props.handleDeleteAuthor}
          style={{ margin: 4 }}
        >
          {author.name}
        </AuthorChip>
      )) : null;

    const noAuthorsMessage = (
      <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
        No authors are currently assigned to this article
      </span>
    );

    return (
      <div>
        <br />
        <div style={styles.wrapper} >
          {authorChips || noAuthorsMessage}
        </div>
        <EditorSearchBar
          model={this.props.model}
          mode="authors"
          fields={['id']}
          length={3}
          handleClick={this.handleClickAddAuthor}
        />
      </div>
    );
  }
}
