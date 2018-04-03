import React from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import _ from 'lodash';

import { capFirstLetter, slugify } from 'lib/utilities';
import { SearchableAuthors } from 'components/admin/form-components/searchable-categories';

// material-ui
import Chip from 'material-ui/Chip';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

class ObjectChip extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onClick = () =>
      this.props.onDelete(this.props.id, this.props.title, this.props.slug);
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
  id: PropTypes.number,
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  style: PropTypes.shape({}),
  children: PropTypes.node,
};

ObjectChip.defaultProps = {
  id: null,
  slug: null,
  style: {},
  children: null,
};

class SearchableSelector extends React.Component {
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

  handleClickAdd = async object => {
    // disable this if saving
    if (this.props.disabled) return;

    const { id, title, slug } = object;
    const alreadyAdded =
      this.props.value.find(
        baseObject =>
          !('slug' in baseObject)
            ? slugify(this.props.category, baseObject.name) === slug
            : baseObject.slug === slug,
      ) !== undefined;

    if (alreadyAdded) {
      await this.props.displayAlert(
        `The ${this.props.category} ${title} has already been added.`,
      );
      return;
    }
    const newObjects = update(this.props.value, {
      $push: [{ id, name: title, slug }],
    });
    this.props.onUpdate(newObjects);
  };

  handleDelete(id, title, slug) {
    // disabled this if saving
    if (this.props.disabled) return;

    const objectSlug = !slug ? slugify(this.props.category, title) : slug;

    const index = this.props.value.findIndex(
      baseObject =>
        !('slug' in baseObject)
          ? slugify(this.props.category, baseObject.name) === objectSlug
          : baseObject.slug === objectSlug,
    );
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
              key={object.id !== null ? object.id : object.name}
              id={object.id}
              title={object.name}
              onDelete={this.handleDelete}
              style={{ margin: 4 }}
            >
              {object.name}
            </ObjectChip>
          ))
        : null;

    const noObjectsMessage = (
      <span style={{ color: 'rgba(0, 0, 0, 0.3)' }}>
        No {this.props.category} are currently assigned to this article
      </span>
    );

    return (
      <div>
        <br />
        <p style={{ marginTop: 0, marginBottom: 10 }}>
          {capFirstLetter(this.props.category)}
        </p>
        <div style={styles.wrapper}>{objectChips || noObjectsMessage}</div>
        <SearchableAuthors
          length={3}
          handleClick={this.handleClickAdd}
          enableAdd
        />
      </div>
    );
  }
}

SearchableSelector.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayAlert: PropTypes.func.isRequired,
  // It isn't a typo and they are required in SearchBar so no need for defaults
  /* eslint-disable react/no-typos, react/require-default-props */
  category: React.PropTypes.oneOf(['staff', 'articles']).isRequired,
  /* eslint-enable react/no-typos, react/require-default-props */
  disabled: PropTypes.bool,
};

SearchableSelector.defaultProps = {
  disabled: false,
};

const EnhancedSearchableSelector = withModals(SearchableSelector);
export { EnhancedSearchableSelector as SearchableSelector };
