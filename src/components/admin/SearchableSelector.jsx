/* eslint react/jsx-no-bind: 0 */

import React from 'react';
import update from 'react-addons-update';
import _ from 'lodash';

import BaseComponent from 'lib/BaseComponent';
import { capFirstLetter } from 'lib/utilities';
import SearchBar from 'components/admin/SearchBar';

// material-ui
import Chip from 'material-ui/Chip';

class ObjectChip extends BaseComponent {
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


export default class SearchableSelector extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.disabled &&
      this.props.objects !== prevProps.objects) {
      this.props.onChange();
    }
  }

  handleClickAdd(object) {
    // disable this if saving
    if (this.props.disabled) return;

    const id = object.id;
    const name = object.name;
    const alreadyAdded = this.props.objects.find(baseObject => baseObject.id === id) !== undefined;

    if (alreadyAdded) {
      window.alert('Already added');
      return;
    }
    const newObjects = update(this.props.objects, { $push: [{ id, name }] });
    this.props.onUpdate(newObjects);
  }

  handleDelete(id) {
    // disabled this if saving
    if (this.props.disabled) return;

    const index = this.props.objects.findIndex(object => object.id === id);
    if (index === -1) {
      throw new Error('The author you are trying to delete cannot be found');
    }
    const newObjects = update(this.props.objects, { $splice: [[index, 1]] });
    this.props.onUpdate(newObjects);
  }

  render() {
    const styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    const objectChips = this.props.objects.length > 0 ?
      _.map(this.props.objects, (object) => (
        <ObjectChip
          key={object.id}
          id={object.id}
          onDelete={this.handleDelete}
          style={{ margin: 4 }}
        >
          {object.name}
        </ObjectChip>
      )) : null;

    const noObjectsMessage = (
      <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
        `No {this.props.mode} are currently assigned to this article`
      </span>
    );

    return (
      <div>
        <br />
        <p style={{ marginTop: 0, marginBottom: 10 }}>{capFirstLetter(this.props.mode)}</p>
        <div style={styles.wrapper} >
          {objectChips || noObjectsMessage}
        </div>
        <SearchBar
          model={this.props.model}
          mode={this.props.mode}
          fields={['id']}
          length={3}
          handleClick={this.handleClickAdd}
        />
      </div>
    );
  }
}
