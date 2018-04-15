import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// Lib
import { debounce, slugifyStaff } from 'lib/utilities';
import FalcorController from 'lib/falcor/FalcorController';

// Custom Components
import { SearchableAuthorsSelector } from 'components/admin/form-components/searchables';
import LoadingOverlay from 'components/admin/LoadingOverlay';
import SaveButton from 'components/admin/article/components/SaveButton';
import UnpublishButton from 'components/admin/article/components/UnpublishButton';
import {
  HttpsUrlField,
  ShortRequiredTextField,
} from 'components/admin/form-components/validated-fields';
import ListSelector from 'components/admin/form-components/ListSelector';
import MaxLenTextField from 'components/admin/form-components/MaxLenTextField';
import { MAX_TEASER_LENGTH } from 'components/admin/lib/constants';

// material-ui
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

class ArticleController extends FalcorController {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.isFormChanged = this.isFormChanged.bind(this);
    this.falcorToState = this.falcorToState.bind(this);
    this.updateTitle = title => this.safeSetState({ title });
    this.updateSlug = slug => this.safeSetState({ slug });
    this.updateAuthors = authors => this.safeSetState({ authors });
    this.updateTeaser = teaser => this.safeSetState({ teaser });
    this.updateImage = imageUrl => this.safeSetState({ imageUrl });
    this.updateCategory = category => this.safeSetState({ category });
    this.safeSetState({
      changed: false,
      saving: false,
      refresh: false,
      title: '',
      slug: '',
      authors: [],
      teaser: '',
      category: '',
      imageUrl: '',
    });

    this.debouncedHandleFormStateChanges = debounce(() => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving) return;

      const changedFlag = this.isFormChanged();
      if (changedFlag !== this.state.changed) {
        this.safeSetState({ changed: changedFlag });
      }
    }, 500);
  }

  async save(jsonGraphEnvelope, processedAuthors, articleId, falcorData) {
    // Update the values
    this.safeSetState({ saving: true });
    const dbUpdates = [this.falcorUpdate(jsonGraphEnvelope)];

    if (processedAuthors !== null) {
      dbUpdates.push(
        this.falcorCall(
          ['articles', 'byId', articleId, 'authors', 'updateAuthors'],
          [falcorData.id, processedAuthors],
          [['name'], ['slug']],
        ),
      );
    }
    await Promise.all(dbUpdates);
    // Reset state after save is done
    this.safeSetState({
      changed: false,
      refresh: true,
      authorsAdded: [],
      authorsDeleted: {},
      changesObject: { mainForm: false, authors: false },
    });
    // This is purely so the 'saved' message can be seen by the user for a second
    setTimeout(() => {
      this.safeSetState({ saving: false });
    }, 1000);
  }

  static getFalcorPathSets(params) {
    return [
      [
        'articles',
        'byId',
        params.id,
        [
          'title',
          'slug',
          'category',
          'teaser',
          'image_url',
          'id',
          'published_at',
        ],
      ],
      [
        'articles',
        'byId',
        params.id,
        'authors',
        { length: 10 },
        ['id', 'name'],
      ],
      ['categories', 'byIndex', { length: 30 }, ['name', 'slug']],
    ];
  }
  falcorToState(data) {
    const article = data.articles.byId[this.props.params.id];
    const title = article.title || '';
    const slug = article.slug || '';
    const teaser = article.teaser || '';
    const category = article.category || '';
    const imageUrl = article.image_url || '';
    const authors = _.toArray(article.authors);
    this.safeSetState({
      title,
      slug,
      teaser,
      category,
      imageUrl,
      authors,
    });
  }

  componentWillMount() {
    super.componentWillMount(this.falcorToState);
  }

  componentWillReceiveProps(nextProps) {
    super.componentWillReceiveProps(nextProps, undefined, this.falcorToState);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  isSameArticle(prevProps, props) {
    return prevProps.params.id === props.params.id;
  }

  formHasUpdated(prevState, state) {
    return (
      this.isFormFieldChanged(prevState.title, state.title) ||
      this.isFormFieldChanged(prevState.slug, state.slug) ||
      this.isFormFieldChanged(prevState.authors, state.authors) ||
      this.isFormFieldChanged(prevState.teaser, state.teaser) ||
      this.isFormFieldChanged(prevState.category, state.category) ||
      this.isFormFieldChanged(prevState.imageUrl, state.imageUrl)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.isSameArticle(prevProps, this.props) &&
      this.formHasUpdated(prevState, this.state) &&
      this.state.ready
    ) {
      // The update wasn't due to a change in article
      this.debouncedHandleFormStateChanges();
    }
  }

  handleDialogClose() {
    if (this.state.saving) return;

    const { page } = this.props.params;
    const pathname = `/articles/page/${page}`;

    const location = { pathname, state: { refresh: this.state.refresh } };
    browserHistory.push(location);
  }

  handleSaveChanges = async () => {
    const articleId = this.props.params.id;
    const falcorData = this.state.data.articles.byId[articleId];

    if (!this.isFormChanged()) {
      throw new Error(
        'Tried to save changes but there were no changes. ' +
          'the save changes button is supposed to be disabled in this case',
      );
    }

    let processedAuthors = this.state.authors.map(author => author.id);
    // Check that all authors are unique
    if (_.uniq(processedAuthors).length !== processedAuthors.length) {
      this.props.displayAlert(
        "You have duplicate authors, as this shouldn't be able" +
          ' to happen, please contact developers. And if you know all the actions' +
          ' you did previously to this and can reproduce them that would be of' +
          ' great help. The save has been cancelled',
      );
      return;
    }
    if (processedAuthors.length === 0) {
      this.props.displayAlert(
        "Sorry, because of some non-trivial issues we currently don't have" +
          ' deleting every single author implemented.' +
          " You hopefully shouldn't need this function either." +
          ' Please re-add an author to be able to save',
      );
      return;
    }

    // Check the special case of someone trying to reassign a category as none
    if (this.state.category === 'none' && falcorData.category !== 'none') {
      this.props.displayAlert(
        'Save cancelled, you cannot reset a category to none.' +
          ' If you wish to have this feature added, speak to the developers',
      );
      return;
    }

    if (
      this.state.imageUrl.length > 4 &&
      this.state.imageUrl.substr(0, 5) !== 'https'
    ) {
      const shouldContinue = await this.props.displayConfirm(
        'You are saving an image without using https. ' +
          'This can be correct in a few cases but is mostly not. Are you sure ' +
          'that you wish to continue saving?',
      );
      if (!shouldContinue) {
        return;
      }
    }

    if (
      processedAuthors.length === 0 &&
      (!falcorData.authors || Object.keys(falcorData.authors).length === 0)
    ) {
      // Indicate that we won't update authors as there were none before and none were added
      processedAuthors = null;
    }

    const shouldUpdateCategory = this.state.category;
    const fields = shouldUpdateCategory
      ? ['title', 'slug', 'teaser', 'image_url', 'category']
      : ['title', 'slug', 'teaser', 'image_url'];
    // Build the jsonGraphEnvelope
    const jsonGraphEnvelope = {
      paths: [['articles', 'byId', articleId, fields]],
      jsonGraph: {
        articles: {
          byId: {
            [articleId]: {},
          },
        },
      },
    };
    // Fill in the data
    jsonGraphEnvelope.jsonGraph.articles.byId[
      articleId
    ].title = this.state.title;
    jsonGraphEnvelope.jsonGraph.articles.byId[articleId].slug = this.state.slug;
    jsonGraphEnvelope.jsonGraph.articles.byId[
      articleId
    ].teaser = this.state.teaser;
    jsonGraphEnvelope.jsonGraph.articles.byId[
      articleId
    ].image_url = this.state.imageUrl;
    if (shouldUpdateCategory) {
      jsonGraphEnvelope.jsonGraph.articles.byId[
        articleId
      ].category = this.state.category;
    }

    this.save(jsonGraphEnvelope, processedAuthors, articleId, falcorData);
  };

  isFormFieldChanged(userInput, falcorData) {
    return userInput !== falcorData && !(!userInput && !falcorData);
  }

  areAuthorsChanged(currentAuthors, falcorAuthors) {
    const falcorAuthorsArray = _.map(falcorAuthors, author => author);
    return (
      falcorAuthorsArray.length !== currentAuthors.length ||
      currentAuthors.some(
        author =>
          falcorAuthorsArray.find(
            falcorAuthor => author.id === falcorAuthor.id,
          ) === undefined,
      )
    );
  }

  isFormChanged() {
    const falcorData = this.state.data.articles.byId[this.props.params.id];
    const changedFlag =
      this.isFormFieldChanged(this.state.title, falcorData.title) ||
      this.isFormFieldChanged(this.state.slug, falcorData.slug) ||
      this.isFormFieldChanged(this.state.teaser, falcorData.teaser) ||
      this.isFormFieldChanged(this.state.category, falcorData.category) ||
      this.isFormFieldChanged(this.state.imageUrl, falcorData.image_url) ||
      this.areAuthorsChanged(this.state.authors, falcorData.authors);
    return changedFlag;
  }

  render() {
    const styles = {
      buttons: {
        marginTop: 24,
        marginBottom: 12,
      },
    };

    if (this.state.ready) {
      if (
        !this.state.data ||
        !this.state.data.articles ||
        !this.state.data.articles.byId
      ) {
        return (
          <div>
            <p>Error: No articles match this id</p>
          </div>
        );
      }

      const { id } = this.props.params;
      const article = this.state.data.articles.byId[id];

      // If it is a new article it won't have any meta data yet so we use the default
      const categories = _.toArray(this.state.data.categories.byIndex);
      categories.push({ name: 'none', slug: 'none' });
      const actionButtons = [
        <SaveButton
          onClick={this.handleSaveChanges}
          style={styles.buttons}
          saving={this.state.saving}
          changed={this.state.changed}
        />,
      ];

      return (
        <Dialog
          title="Article Editor"
          actions={actionButtons}
          open
          modal={false}
          autoScrollBodyContent
          onRequestClose={this.handleDialogClose}
        >
          {this.state.saving ? <LoadingOverlay /> : null}
          <ShortRequiredTextField
            floatingLabelText="Title"
            value={this.state.title}
            onUpdate={this.updateTitle}
            disabled={this.state.saving}
          />
          <ShortRequiredTextField
            floatingLabelText={`Slug${
              !article.published_at
                ? ''
                : ' - You cannot edit the slug of a published article. Unpublish this article to edit the slug'
            }`}
            value={this.state.slug}
            onUpdate={this.updateSlug}
            disabled={this.state.saving || Boolean(article.published_at)}
            fullWidth
          />
          <ListSelector
            label="Category"
            chosenElement={this.state.category}
            update={this.updateCategory}
            elements={categories}
            disabled={this.state.saving}
            fullWidth
          />
          <br />
          <HttpsUrlField
            floatingLabelText="Image"
            value={this.state.imageUrl}
            onUpdate={this.updateImage}
            disabled={this.state.saving}
            fullWidth
          />
          <br />
          <MaxLenTextField
            name="teaser"
            value={this.state.teaser}
            maxLen={MAX_TEASER_LENGTH}
            onUpdate={this.updateTeaser}
          />
          <br />
          <SearchableAuthorsSelector
            elements={this.state.authors}
            onChange={this.debouncedHandleFormStateChanges}
            onUpdate={this.updateAuthors}
            disabled={this.state.saving}
            mode="staff"
            slugify={slugifyStaff}
          />
          <br />
          <Divider />
          <br />
          <UnpublishButton
            save={this.save}
            id={this.props.params.id}
            falcorUpdate={this.falcorUpdate}
            style={styles.buttons}
            published_at={article.published_at}
          />
        </Dialog>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }
}

const EnhancedArticleController = withModals(ArticleController);
export { EnhancedArticleController as ArticleController };
