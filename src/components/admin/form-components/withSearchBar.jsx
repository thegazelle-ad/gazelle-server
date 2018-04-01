import React from 'react';
// import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';

// import { updateFieldValue } from 'components/admin/lib/form-field-updaters';
import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';
// import { capFirstLetter, slugify, debounce } from 'lib/utilities';
import { debounce } from 'lib/utilities';
import { getDisplayName } from 'lib/higher-order-helpers';
import { withFalcor } from 'src/components/hocs/falcor-hocs';

// material-ui
// import TextField from 'material-ui/TextField';
// import Menu from 'material-ui/Menu';
// import MenuItem from 'material-ui/MenuItem';
// import ContentAdd from 'material-ui/svg-icons/content/add';

const withSearchableConcept = (fields, formatter, category) => WrappedField => {
  const debounceTime = 250;
  const SearchableConcept = originalProps =>
    class Searchable extends React.Component {
      constructor(props) {
        super(props);
        this.safeSetState({
          suggestions: [],
        });
      }

      handleChange(query) {
        debounce(() => {
          if (!query.trim()) {
            this.safeSetState({ suggestions: [] });
            return;
          }

          let pathSets = originalProps.extraPathSets || [];
          pathSets = pathSets.reduce(
            (arr, pathSet) =>
              arr.push(
                [
                  'search',
                  originalProps.category,
                  query,
                  { length: originalProps.length },
                ].concat(pathSet),
              ),
            [
              [
                'search',
                originalProps.category,
                query,
                { length: originalProps.length },
                Object.assign({}, fields, originalProps.fields),
              ],
            ],
          );

          this.props.falcor.get(...pathSets).then(x => {
            if (!x) {
              this.safeSetState({ suggestions: [] });
              return;
            }
            x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
            const suggestions = _.toArray(
              x.json.search[originalProps.category][query],
            ).map(item => ({ title: formatter(item), id: item.id }));
            this.safeSetState({ suggestions });
          });
        }, debounceTime)();
      }

      render() {
        return (
          <WrappedField
            suggestions={this.state.suggestions}
            /* eslint-disable react/jsx-no-bind */
            updateSuggestions={this.handleChange.bind(this)}
            /* eslint-enable react/jsx-no-bind */
            category={category}
            {...originalProps}
          />
        );
      }
    };

  SearchableConcept.displayName = `SearchableConcept(${getDisplayName(
    WrappedField,
  )})`;
  return withFalcor(SearchableConcept);
};

export { withSearchableConcept };

// const withSearchBar = config => {
//   if (!('formatter' in config) || !_.isFunction(config.formatter)) {
//     throw new Error(
//       'withSearchBar.config.formatter must be supplied as a function.',
//     );
//   }
//   if (!('fields' in config) || !_.isArray(config.fields)) {
//     throw new Error(
//       'withSearchBar.config.fields must be supplied as an array.',
//     );
//   }
//   if (!('displayName' in config) || !_.isString(config.displayName)) {
//     throw new Error(
//       'withSearchBar.config.displayName must be supplied as a string.',
//     );
//   }
//   if (!('category' in config) || !_.isString(config.category)) {
//     throw new Error(
//       'withSearchBar.config.category must be supplied as a string.',
//     );
//   }

//   class SearchBar extends BaseComponent {
//     constructor(props) {
//       super(props);
//       this.fieldUpdaters = {
//         searchValue: updateFieldValue.bind(this, 'searchValue', undefined),
//       };
//       this.safeSetState({
//         searchValue: '',
//         searchSuggestions: [],
//       });

//       this.debouncedGetSuggestions = debounce(() => {
//         const query = this.state.searchValue;
//         if (!query.trim()) {
//           this.safeSetState({ searchSuggestions: [] });
//           return;
//         }

//         let pathSets = this.props.extraPathSets || [];
//         pathSets = pathSets.reduce(
//           (arr, pathSet) =>
//             arr.push(
//               ['search', 'posts', query, { length: this.props.length }].concat(
//                 pathSet,
//               ),
//             ),
//           [
//             [
//               'search',
//               config.category,
//               query,
//               { length: this.props.length },
//               config.fields,
//             ],
//           ],
//         );

//         this.props.model.get(...pathSets).then(x => {
//           if (!x) {
//             this.safeSetState({ searchSuggestions: [] });
//             return;
//           }
//           x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
//           // This ternary statement will be removed when database
//           // renaming completes, see ref #327.
//           const suggestions =
//             config.category === 'articles'
//               ? x.json.search.posts[query]
//               : x.json.search[config.category][query];

//           const suggestionsArray = _.map(suggestions, value => value);
//           this.safeSetState({ searchSuggestions: suggestionsArray });
//         });
//       }, this.props.debounceTime || 250);
//     }

//     componentDidUpdate() {
//       this.debouncedGetSuggestions();
//     }

//     componentWillReceiveProps() {
//       this.safeSetState({
//         searchValue: '',
//         searchSuggestions: [],
//       });
//     }

//     handleClick(article) {
//       this.safeSetState({
//         searchValue: '',
//         searchSuggestions: [],
//       });
//       this.props.handleClick(article);
//     }

//     render() {
//       const searchBarClass = 'search-bar';
//       const searchBarResultClass = 'search-bar-result';
//       const slug = this.props.enableAdd
//         ? slugify(config.category, this.state.searchValue)
//         : '';
//       return (
//         <div
//           className={`${searchBarClass} ${searchBarClass}-${config.category}`}
//         >
//           <TextField
//             floatingLabelText={`Search for ${capFirstLetter(config.category)}`}
//             hintText={capFirstLetter(config.category)}
//             fullWidth={this.props.fullWidth}
//             value={this.state.searchValue}
//             onChange={this.fieldUpdaters.searchValue}
//           />
//           <div>
//             <Menu style={!this.props.fullWidth && { width: 200 }}>
//               {this.props.enableAdd &&
//                 this.state.searchValue &&
//                 this.state.searchSuggestions.length === 0 && (
//                   <div
//                     className={`${searchBarResultClass} search-bar-${
//                       config.category
//                     }`}
//                     key={slug}
//                   >
//                     {/* eslint-disable react/jsx-no-bind */}
//                     <MenuItem
//                       leftIcon={<ContentAdd />}
//                       primaryText={this.state.searchValue}
//                       onClick={this.handleClick.bind(this, {
//                         value: this.state.searchValue,
//                         slug,
//                         id: null,
//                       })}
//                       disabled={this.props.disabled}
//                     />
//                     {/* eslint-enable react/jsx-no-bind */}
//                   </div>
//                 )}
//               {/* eslint-disable react/jsx-no-bind */
//               this.state.searchSuggestions.map(item => (
//                 <div
//                   className={`search-bar-result search-bar-${config.category}`}
//                   key={item.slug}
//                 >
//                   <MenuItem
//                     primaryText={config.formatter(item)}
//                     onClick={this.handleClick.bind(this, item)}
//                     disabled={this.props.disabled}
//                   />
//                 </div>
//               ))
//               /* eslint-enable react/jsx-no-bind */
//               }
//             </Menu>
//           </div>
//         </div>
//       );
//     }
//   }

//   /* eslint-disable consistent-return */
//   SearchBar.propTypes = {
//     model: React.PropTypes.shape({
//       get: React.PropTypes.func.isRequired,
//     }).isRequired,
//     fullWidth: React.PropTypes.bool,
//     length: React.PropTypes.number.isRequired,
//     handleClick: React.PropTypes.func.isRequired,
//     debounceTime: React.PropTypes.number,
//     disabled: React.PropTypes.bool,
//     enableAdd: React.PropTypes.bool,
//     // Each of these will be concatenated onto the base search path
//     // so don't supply the base search path
//     extraPathSets: (props, propName, componentName) => {
//       const prop = props[propName];
//       if (!prop) {
//         // Wasn't supplied so nevermind
//         return;
//       }
//       let error = new Error(
//         `Invalid prop ${propName} supplied to ${componentName}. It must be an array of pathSets.`,
//       );
//       if (!(prop instanceof Array)) {
//         return error;
//       }
//       const valid = prop.every(value => {
//         if (!(value instanceof Array)) {
//           return false;
//         } else if (value[0] === 'search') {
//           error = new Error(
//             `Invalid prop ${propName} supplied to ${componentName}. ` +
//               'Just add the extension, do not add "search"... as this is already considered.',
//           );
//           return false;
//         }
//         return true;
//       });
//       if (!valid) {
//         return error;
//       }
//     },
//   };

//   SearchBar.displayName = `SearchBar(${config.displayName})`;
//   return SearchBar;
// };

// export default withSearchBar;
