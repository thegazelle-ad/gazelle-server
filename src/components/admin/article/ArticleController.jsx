import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';

// Lib
import { debounce } from 'lib/utilities';
import FalcorController from 'lib/falcor/FalcorController';

// Custom Components
import SearchableSelector from 'components/admin/form-components/SearchableSelector';
import LoadingOverlay from 'components/admin/LoadingOverlay';
import SaveButton from 'components/admin/article/components/SaveButton';
import UnpublishButton from 'components/admin/article/components/UnpublishButton.jsx';
import ListSelector from 'components/admin/form-components/ListSelector';
import MaxLenTextField from 'components/admin/form-components/MaxLenTextField';

// material-ui
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

export default class ArticleController extends FalcorController {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.isFormChanged = this.isFormChanged.bind(this);
    this.updateAuthors = this.updateAuthors.bind(this);
    this.updateTeaser = this.updateTeaser.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.safeSetState({
      changed: false,
      saving: false,
      authors: [],
      teaser: '',
      category: '',
      image: '',
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

  save(jsonGraphEnvelope, processedAuthors, articleSlug, falcorData) {
    // Update the values
    this.safeSetState({ saving: true });
    const updatePromises = [this.falcorUpdate(jsonGraphEnvelope)];

    if (processedAuthors !== null) {
      updatePromises.push(this.falcorCall(
        ['articles', 'bySlug', articleSlug, 'authors', 'updateAuthors'],
        [falcorData.id, processedAuthors],
        [['name'], ['slug']]
      )
      );
    }

    Promise.all(updatePromises).then(() => {
      // Reset state after save is done
      this.safeSetState({
        changed: false,
        authorsAdded: [],
        authorsDeleted: {},
        changesObject: { mainForm: false, authors: false },
      });
      // This is purely so the 'saved' message can be seen by the user for a second
      setTimeout(() => { this.safeSetState({ saving: false }); }, 1000);
    });
  }

  updateAuthors(authors) {
    this.safeSetState({ authors });
  }

  updateTeaser(teaser) {
    this.safeSetState({ teaser });
  }

  updateImage(image) {
    this.safeSetState({ image });
  }

  updateCategory(category) {
    this.safeSetState({ category });
  }

  static getFalcorPathSets(params) {
    return [
      [
        'articles', 'bySlug',
        params.slug,
        ['title', 'category', 'teaser', 'image', 'id', 'published_at'],
      ],
      ['articles', 'bySlug', params.slug, 'authors', { length: 10 }, ['id', 'name']],
      ['categories', 'byIndex', { length: 30 }, ['name', 'slug']],
    ];
  }

  componentWillMount() {
    const falcorCallback = (data) => {
      const article = data.articles.bySlug[this.props.params.slug];
      const teaser = article.teaser || '';
      const category = article.category || '';
      const image = article.image || '';
      const authors = _.map(article.authors, author => author);

      this.safeSetState({
        teaser, category, image, authors,
      });
    };
    super.componentWillMount(falcorCallback);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallback = (data) => {
      const article = data.articles.bySlug[this.props.params.slug];
      const teaser = article.teaser || '';
      const category = article.category || '';
      const image = article.image || '';
      const authors = _.map(article.authors, author => author);

      this.safeSetState({
        teaser, category, image, authors,
      });
    };
    super.componentWillReceiveProps(nextProps, undefined, falcorCallback);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  isSameArticle(prevProps, props) {
    return prevProps.params.slug === props.params.slug;
  }

  formHasUpdated(prevState, state) {
    return (
      this.isFormFieldChanged(prevState.authors, state.authors) ||
      this.isFormFieldChanged(prevState.teaser, state.teaser) ||
      this.isFormFieldChanged(prevState.category, state.category) ||
      this.isFormFieldChanged(prevState.image, state.image)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isSameArticle(prevProps, this.props) &&
	this.formHasUpdated(prevState, this.state) &&
	this.state.ready) {
      // The update wasn't due to a change in article
      this.debouncedHandleFormStateChanges();
    }
  }

  handleDialogClose() {
    if (this.state.saving) return;

    const page = this.props.params.page;
    const path = `/articles/page/${page}`;
    browserHistory.push(path);
  }

  handleSaveChanges() {
    const articleSlug = this.props.params.slug;
    const falcorData = this.state.data.articles.bySlug[articleSlug];

    if (!this.isFormChanged()) {
      throw new Error('Tried to save changes but there were no changes. ' +
                      'the save changes button is supposed to be disabled in this case'
      );
    }

    let processedAuthors = this.state.authors.map(author => author.id);
    // Check that all authors are unique
    if (_.uniq(processedAuthors).length !== processedAuthors.length) {
      window.alert("You have duplicate authors, as this shouldn't be able" +
                   ' to happen, please contact developers. And if you know all the actions' +
                   ' you did previously to this and can reproduce them that would be of' +
                   ' great help. The save has been cancelled');
      return;
    }
    if (processedAuthors.length === 0) {
      window.alert("Sorry, because of some non-trivial issues we currently don't have" +
                   ' deleting every single author implemented.' +
                   " You hopefully shouldn't need this function either." +
                   ' Please re-add an author to be able to save');
      return;
    }

    // Check the special case of someone trying to reassign a category as none
    if (this.state.category === 'none' && falcorData.category !== 'none') {
      window.alert('Save cancelled, you cannot reset a category to none.' +
                   ' If you wish to have this feature added, speak to the developers');
      return;
    }

    if (this.state.image.length > 4 && this.state.image.substr(0, 5) !== 'https') {
      if (!window.confirm('You are saving an image without using https. ' +
                          'This can be correct in a few cases but is mostly not. Are you sure ' +
                          ' you wish to continue saving?')) {
        return;
      }
    }

    if (processedAuthors.length === 0 &&
	(!falcorData.authors || Object.keys(falcorData.authors).length === 0)
    ) {
      // Indicate that we won't update authors as there were none before and none were added
      processedAuthors = null;
    }

    const shouldUpdateCategory = this.state.category;
    const fields = shouldUpdateCategory ? ['teaser', 'image', 'category'] : ['teaser', 'image'];
    // Build the jsonGraphEnvelope
    const jsonGraphEnvelope = {
      paths: [
        ['articles', 'bySlug', articleSlug, fields],
      ],
      jsonGraph: {
        articles: {
          bySlug: {
            [articleSlug]: {},
          },
        },
      },
    };
    // Fill in the data
    jsonGraphEnvelope.jsonGraph.articles.bySlug[articleSlug].teaser = this.state.teaser;
    jsonGraphEnvelope.jsonGraph.articles.bySlug[articleSlug].image = this.state.image;
    if (shouldUpdateCategory) {
      jsonGraphEnvelope.jsonGraph.articles.bySlug[articleSlug].category = this.state.category;
    }

    this.save(jsonGraphEnvelope, processedAuthors, articleSlug, falcorData);
  }

  isFormFieldChanged(userInput, falcorData) {
    return ((userInput !== falcorData) && !(!userInput && !falcorData));
  }

  areAuthorsChanged(currentAuthors, falcorAuthors) {
    const falcorAuthorsArray = _.map(falcorAuthors, author => author);
    return (
      falcorAuthorsArray.length !== currentAuthors.length ||
      currentAuthors.some(author => (
        falcorAuthorsArray.find(falcorAuthor => author.id === falcorAuthor.id) === undefined
      ))
    );
  }

  isFormChanged() {
    const falcorData = this.state.data.articles.bySlug[this.props.params.slug];
    const changedFlag =
      this.isFormFieldChanged(this.state.teaser, falcorData.teaser) ||
      this.isFormFieldChanged(this.state.category, falcorData.category) ||
      this.isFormFieldChanged(this.state.image, falcorData.image) ||
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
      if (!this.state.data || !this.state.data.articles.bySlug) {
        return <div><p>Error: No articles match this slug</p></div>;
      }

      const slug = this.props.params.slug;
      const article = this.state.data.articles.bySlug[slug];

      // If it is a new article it won't have any meta data yet so we use the default
      const categories = this.state.data.categories.byIndex;
      categories.none = { name: 'none', slug: 'none' };

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
          <h2>{article.title}</h2>
          <Divider />
          <TextField
            disabled
            defaultValue={article.title}
            floatingLabelText="Title"
            fullWidth
          />
          <ListSelector
            type="Category"
            chosenType={this.state.category || 'none'}
            update={this.updateCategory}
            disabled={this.state.saving}
            types={categories}
          />
          <TextField
            name="image"
            value={this.state.image}
            floatingLabelText="Image (Remember to use https:// not http://)"
            disabled={this.state.saving}
            onChange={this.updateImage}
            fullWidth
          /><br />
          <MaxLenTextField
            name="teaser"
            value={this.state.teaser}
            maxLen={156}
            onUpdate={this.updateTeaser}
          />
          <br />
          <SearchableSelector
            objects={this.state.authors}
            onChange={this.debouncedHandleFormStateChanges}
            onUpdate={this.updateAuthors}
            disabled={this.state.saving}
            model={this.props.model}
            mode="authors"
            disabled={this.state.saving}
          />
          <br />
          <Divider />
          <br />
          <UnpublishButton
            save={this.save}
            slug={this.props.params.slug}
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
