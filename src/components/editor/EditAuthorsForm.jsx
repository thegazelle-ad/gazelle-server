/* eslint react/jsx-no-bind: 0 */

import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import EditorSearchBar from 'components/editor/EditorSearchBar';
import _ from 'lodash';

// material-ui
import Chip from 'material-ui/Chip';

export default class EditAuthorsForm extends BaseComponent {
  constructor(props) {
    super(props);
    this.safeSetState({
      addAuthorValue: "",
      authorAutocomplete: [],
    });
    this.handleClickAddAuthor = this.handleClickAddAuthor.bind(this);
  }

  componentDidUpdate() {
    if (!this.props.disabled) {
      this.props.onChange();
    }
  }

  handleClickAddAuthor(author) {
    this.props.handleAddAuthor(author.id, author.name, false);
  }

  render() {
    const styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    }

    const renderChips = (authors) =>
      _.map(authors, (author) => {
        return(
          <Chip
            key={author.id}
            onRequestDelete={this.props.handleDeleteAuthor.bind(null, author.id, true)}
            style={{margin: 4}}
          >
            {author.name}
          </Chip>
        )
      });

    return (
      <div>
        {
          // TODO: EMIL: not exactly sure what this code is doing so I didnt want to delete
          // Please remove if it's not necessary


          // _.map(this.props.authors, (author) => {
          //   // Striked will correctly evaluate to false if there is no key
          //   // with that slug yet, which means it has neither been striked nor unstriked yet
          //   // It will return undefined which is a falsy value
          //   let striked = this.props.authorsDeleted[author.id];
          //   let authorNameStyle = {marginLeft: "1em"};
          //   if (striked) {
          //     authorNameStyle.textDecoration = "line-through";
          //     authorNameStyle.opacity = 0.5;
          //   }
          //
          //   return(
          //     <div key={author.id}>
          //       {
          //         !striked
          //           ?
          //           <button
          //             type="button"
          //             className="toggle-button"
          //             aria-label="Remove Author Button"
          //             onClick={this.props.handleDeleteAuthor.bind(null, author.id, true)}
          //           >&times;&nbsp;</button>
          //           :
          //           <button
          //             type="button"
          //             className="toggle-button"
          //             aria-label="Remove Author Button"
          //             onClick={this.props.handleAddAuthor.bind(null, author.id, true)}
          //           >~&nbsp;</button>
          //       }
          //       <div style={authorNameStyle}>{author.name}</div>
          //     </div>
          //   );
          // })
        }
        <br />
        <p style={{marginBottom: 10}}>Authors</p>
        <div style={styles.wrapper} >
          {renderChips(this.props.authors)}
          {renderChips(this.props.authorsAdded)}
        </div>
        <EditorSearchBar
          model={this.props.model}
          mode="authors"
          fields={['id']}
          length={3}
          handleClick={this.handleClickAddAuthor}
        />
      </div>
    )
  }
}
