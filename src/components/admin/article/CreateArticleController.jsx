import React from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Helpers
import { slugifyStaff } from 'lib/utilities';
import { parseFalcorPseudoArray } from 'lib/falcor/falcor-utilities';
import { compose } from 'lib/higher-order-helpers';

// Custom Components
import ImageUrlField from 'components/admin/article/components/ImageUrlField';
import TitleField from 'components/admin/article/components/TitleField';
import ListSelector from 'components/admin/form-components/ListSelector';
import MaxLenTextField from 'components/admin/form-components/MaxLenTextField';
import { MAX_TEASER_LENGTH } from 'components/admin/lib/constants';
import { SearchableAuthorsSelector } from 'components/admin/form-components/searchables';
import { FullPageLoadingOverlay } from 'components/admin/FullPageLoadingOverlay';

// Material UI
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

// HOCs
import {
  withFalcorData,
  withFalcor,
  buildPropMerger,
} from 'components/hocs/falcor-hocs';
import { withModals } from 'components/admin/hocs/modals/withModals';

const falcorPaths = [['categories', 'byIndex', { length: 30 }, ['name', 'id']]];

const propMerger = buildPropMerger((data, currentProps) => {
  const categories = parseFalcorPseudoArray(data.categories.byIndex).filter(
    category => _.get(category, 'id') && _.get(category, 'name'),
  );
  return {
    ...currentProps,
    categories,
  };
});

class CreateArticleController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      slug: '',
      authors: [],
      teaser: '',
      category: -1,
      imageUrl: '',
    };
  }

  updateTitle = title => this.setState({ title });
  updateSlug = slug => this.setState({ slug });
  updateAuthors = authors => this.setState({ authors });
  updateTeaser = teaser => this.setState({ teaser });
  updateImage = imageUrl => this.setState({ imageUrl });
  updateCategory = category => this.setState({ category });

  handleDialogClose = () => {
    const { page } = this.props.params;
    const pathname = `/articles/page/${page}`;

    const location = { pathname, state: { refresh: false } }; // TODO: Add proper refresh
    browserHistory.push(location);
  };

  validateArticle = async () => {
    // Check that it has all the required fields
    const requiredFields = ['title', 'slug'];
    const errorMessage = requiredFields
      .map(key => {
        if (!this.state[key]) {
          return `${key} is a required field`;
        }
        return null;
      })
      .filter(x => x !== null)
      .join('\n');
    if (errorMessage) {
      await this.props.displayAlert(errorMessage);
      return false;
    }
    return true;
  };

  handleCreateArticle = async () => {
    if (!await this.validateArticle()) {
      return;
    }

    const createArticleArgument = _.pick(this.state, [
      'title',
      'slug',
      'authors',
      'teaser',
      'category',
      'imageUrl',
    ]);

    await this.props.falcor.call(
      ['articles', 'createNew'],
      [createArticleArgument],
    );
  };

  render() {
    const actionButtons = [
      <RaisedButton
        primary
        onClick={this.handleCreateArticle}
        label="Create Article"
      />,
    ];
    return (
      <Dialog
        open
        title="Create New Article"
        modal={false}
        autoScrollBodyContent
        actions={actionButtons}
        onRequestClose={this.handleDialogClose}
      >
        <TitleField title={this.state.title} onUpdate={this.updateTitle} />
        {/* This is temporary until Will merges in his text fields with DB lengths */}
        {/* We also want to make this required */}
        <MaxLenTextField
          name="slug"
          value={this.state.slug}
          maxLen={100}
          onUpdate={this.updateSlug}
        />
        <ListSelector
          label="Category"
          chosenElement={this.state.category}
          update={this.updateCategory}
          elements={this.props.categories}
        />
        <ImageUrlField
          imageUrl={this.state.imageUrl}
          updateImage={this.updateImage}
        />
        <MaxLenTextField
          name="teaser"
          value={this.state.teaser}
          maxLen={MAX_TEASER_LENGTH}
          onUpdate={this.updateTeaser}
        />
        <SearchableAuthorsSelector
          elements={this.state.authors}
          onChange={this.debouncedHandleFormStateChanges}
          onUpdate={this.updateAuthors}
          disabled={this.state.saving}
          mode="staff"
          slugify={slugifyStaff}
        />
      </Dialog>
    );
  }
}

CreateArticleController.propTypes = {
  params: PropTypes.shape({
    page: PropTypes.string.isRequired,
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  falcor: PropTypes.shape({
    call: PropTypes.func.isRequired,
  }).isRequired,
  displayAlert: PropTypes.func.isRequired,
};

const EnhancedCreateArticleController = compose(
  withFalcorData(falcorPaths, propMerger, FullPageLoadingOverlay),
  withFalcor,
  withModals,
)(CreateArticleController);

export { EnhancedCreateArticleController as CreateArticleController };
