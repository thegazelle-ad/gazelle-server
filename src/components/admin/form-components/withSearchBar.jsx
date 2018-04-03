import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';
import { debounce } from 'lib/utilities';
import { getDisplayName } from 'lib/higher-order-helpers';

export const withSearchableConcept = (
  fields,
  formatter,
  category,
) => WrappedField => {
  const debounceTime = 250;
  class Searchable extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        suggestions: [],
      };

      this.handleChange = this.handleChange.bind(this);
      this.handleClick = this.handleClick.bind(this);

      this.debounceSuggestions = debounce(query => {
        if (!query.trim()) {
          this.setState({ suggestions: [] });
          return;
        }

        let pathSets = this.props.extraPathSets || [];
        pathSets = pathSets.reduce(
          (arr, pathSet) => {
            arr.push(
              ['search', category, query, { length: this.props.length }].concat(
                pathSet,
              ),
            );
            return arr;
          },
          [
            [
              'search',
              category,
              query,
              { length: this.props.length },
              _.uniq([...fields, ...this.props.fields]),
            ],
          ],
        );

        this.props.falcor.get(...pathSets).then(x => {
          if (!x) {
            this.setState({ suggestions: [] });
            return;
          }
          x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
          const suggestions = _.toArray(x.json.search[category][query]).map(
            item => ({ title: formatter(item), id: item.id, slug: item.slug }),
          );
          this.setState({ suggestions });
        });
      }, debounceTime);
    }

    handleChange(query) {
      this.debounceSuggestions(query);
    }

    handleClick(item) {
      this.setState({ suggestions: [] });
      this.props.handleClick(item);
    }

    render() {
      const passedProps = _.omit(this.props, 'handleClick');
      return (
        <WrappedField
          suggestions={this.state.suggestions}
          updateSuggestions={this.handleChange}
          category={category}
          handleClick={this.handleClick}
          {...passedProps}
        />
      );
    }
  }

  Searchable.propTypes = {
    falcor: PropTypes.shape({
      get: PropTypes.func.isRequired,
    }).isRequired,
    length: PropTypes.number,
    fields: PropTypes.arrayOf(PropTypes.string),
    handleClick: PropTypes.func.isRequired,
    extraPathSets: PropTypes.arrayOf(
      PropTypes.arrayOf(
        (propValue, key, componentName, location, propFullName) => {
          if (!_.isString(propValue[key]) && !_.isNumber(propValue[key])) {
            return new Error(
              `Invalid prop ${propFullName} supplied to` +
                ` ${componentName}. Validation failed.`,
            );
          }
          if (propValue[0] === 'search') {
            return new Error(
              `Invalid prop ${propFullName} supplied to ${componentName}. ` +
                'Just add the extension, do not add "search"... as this is already considered.',
            );
          }
          return true;
        },
      ),
    ),
  };

  Searchable.defaultProps = {
    length: 3,
    fields: [],
    extraPathSets: [[]],
  };

  Searchable.displayName = `SearchableField(${getDisplayName(WrappedField)})`;
  return Searchable;
};
