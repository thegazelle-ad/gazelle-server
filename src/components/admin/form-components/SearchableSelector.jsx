import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import _ from 'lodash';

import { capFirstLetter } from 'lib/utilities';
import SearchBar from 'components/admin/SearchBar';

// material-ui
import Chip from 'material-ui/Chip';

class ObjectChip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClick = () => this.props.onDelete(this.props.id);
  }

  render() {
    return (
      <Chip onRequestDelete={this.onClick} style={this.props.style}>
        {this.props.children}
      </Chip>
    );
  }
}

ObjectChip.propTypes = {
  onDelete: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  style: PropTypes.shape({}),
  children: PropTypes.node,
};

ObjectChip.defaultProps = {
  style: {},
  children: null,
};

export default class SearchableSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.disabled && this.props.value !== prevProps.value) {
      this.props.onChange();
    }
  }

  handleClickAdd(object) {
    // disable this if saving
    if (this.props.disabled) return;

    const { id, name } = object;
    const alreadyAdded =
      this.props.value.find(baseObject => baseObject.id === id) !== undefined;

    if (alreadyAdded) {
      window.alert('Already added');
      return;
    }
    const newObjects = update(this.props.value, { $push: [{ id, name }] });
    this.props.onUpdate(newObjects);
  }

  handleDelete(id) {
    // disabled this if saving
    if (this.props.disabled) return;

    const index = this.props.value.findIndex(object => object.id === id);
    if (index === -1) {
      throw new Error(
        'You tried to delete an object not currently selected. ' +
          "This shouldn't happen, please let the developers know that it did.",
      );
    }
    const newObjects = update(this.props.value, { $splice: [[index, 1]] });
    this.props.onUpdate(newObjects);
  }

  render() {
    const styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    const objectChips =
      this.props.value.length > 0
        ? _.map(this.props.value, object => (
            <ObjectChip
              key={object.id}
              id={object.id}
              onDelete={this.handleDelete}
              style={{ margin: 4 }}
            >
              {object.name}
            </ObjectChip>
          ))
        : null;

    const noObjectsMessage = (
      <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
        `No {this.props.mode} are currently assigned to this article`
      </span>
    );

    return (
      <div>
        <br />
        <p style={{ marginTop: 0, marginBottom: 10 }}>
          {capFirstLetter(this.props.mode)}
        </p>
        <div style={styles.wrapper}>{objectChips || noObjectsMessage}</div>
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

SearchableSelector.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  // It isn't a typo and they are required in SearchBar so no need for defaults
  /* eslint-disable react/no-typos, react/require-default-props */
  mode: SearchBar.propTypes.mode,
  model: SearchBar.propTypes.model,
  /* eslint-enable react/no-typos, react/require-default-props */
  disabled: PropTypes.bool,
};

SearchableSelector.defaultProps = {
  disabled: false,
};
