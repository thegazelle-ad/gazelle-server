import { withSearchableConcept } from 'components/admin/form-components/withSearchBar';
import { SearchBar } from 'components/admin/form-components/SearchBar';

export const SearchableAuthors = withSearchableConcept(
  ['name', 'slug', 'id'],
  item => item.name,
  'staff',
)(SearchBar);
