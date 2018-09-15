import React from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import Plain from 'slate-plain-serializer';
import moment from 'moment';

// Lib
import { debounce } from 'lib/utilities';
import FalcorController from 'lib/falcor/FalcorController';
import { getArticleListPath } from 'routes/admin-helpers';
import {
  validateChanges,
  buildJsonGraphEnvelope,
  buildHtmlFromMarkdown,
} from './article-logic';

// Custom Components
import {
  SearchableAuthorsSelector,
  SearchableTagsSelector,
} from 'components/admin/form-components/searchables';
import LoadingOverlay from 'components/admin/LoadingOverlay';
import SaveButton from 'components/admin/article/components/SaveButton';
import UnpublishButton from 'components/admin/article/components/UnpublishButton';
import {
  HttpsUrlField,
  ShortRequiredTextField,
} from 'components/admin/form-components/validated-fields';
import ListSelector from 'components/admin/form-components/ListSelector';
import MaxLenTextField from 'components/admin/form-components/MaxLenTextField';
import { MarkdownEditor } from 'components/admin/editor/MarkdownEditor';
import { MAX_TEASER_LENGTH } from 'components/admin/lib/constants';
import ArticlePreview from 'components/admin/article/components/ArticlePreview';

// material-ui
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

class ArticleController extends FalcorController {
  constructor(props) {
    super(props);
    this.save = this.save.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.returnToApp = this.returnToApp.bind(this);
    this.isFormChanged = this.isFormChanged.bind(this);
    this.falcorToState = this.falcorToState.bind(this);
    this.updateTitle = title => this.safeSetState({ title });
    this.updateSlug = slug => this.safeSetState({ slug });
    this.updateAuthors = authors => this.safeSetState({ authors });
    this.updateMarkdown = markdown => this.safeSetState({ markdown });
    this.updateTags = tags => this.safeSetState({ tags });
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
      tags: [],
      teaser: '',
      category: null,
      imageUrl: '',
      markdown: Plain.deserialize(''),
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

  async save(jsonGraphEnvelope, processedAuthors, processedTags, articleId) {
    // Update the values
    this.safeSetState({ saving: true });
    const dbUpdates = [this.falcorUpdate(jsonGraphEnvelope)];

    if (processedAuthors !== null) {
      dbUpdates.push(
        this.falcorCall(
          ['articles', 'bySlug', this.state.slug, 'authors', 'updateAuthors'],
          [articleId, processedAuthors],
          [['name'], ['slug']],
        ),
      );
    }

    if (processedTags && processedTags !== null) {
      dbUpdates.push(
        this.falcorCall(
          ['articles', 'bySlug', this.state.slug, 'tags', 'updateTags'],
          [articleId, processedTags],
          [['name'], ['slug']],
        ),
      );
    }

    await Promise.all(dbUpdates);

    // Reset state after save is done
    this.safeSetState({
      changed: false,
      refresh: true,
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
          'markdown',
          'teaser',
          'image_url',
          'id',
          'published_at',
        ],
      ],
      ['articles', 'byId', params.id, 'category', 'id'],
      [
        'articles',
        'byId',
        params.id,
        'authors',
        { length: 10 },
        ['id', 'name'],
      ],
      [
        'articles',
        'byId',
        params.id,
        'tags',
        { length: 10 },
        ['id', 'name', 'slug'],
      ],
      ['categories', 'byIndex', { length: 30 }, ['name', 'id']],
    ];
  }

  falcorToState(data) {
    const article = data.articles.byId[this.props.params.id];
    const title = article.title || '';
    const markdown = Plain.deserialize(article.markdown || '');
    const slug = article.slug || '';
    const teaser = article.teaser || '';
    const category = _.get(article, 'category.id', null);
    const imageUrl = article.image_url || '';
    const authors = _.toArray(article.authors);
    const tags = _.toArray(article.tags);

    this.safeSetState({
      tags,
      title,
      markdown,
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
      this.isFormFieldChanged(prevState.tags, state.tags) ||
      this.isFormFieldChanged(prevState.title, state.title) ||
      this.isFormFieldChanged(
        Plain.serialize(prevState.markdown),
        Plain.serialize(state.markdown),
      ) ||
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

  returnToApp() {
    if (this.state.saving) return;

    const pathname = getArticleListPath(0);

    const location = { pathname, state: { refresh: this.state.refresh } };
    this.safeSetState({ refresh: false });
    browserHistory.push(location);
  }

  handleSaveChanges = async () => {
    if (!this.isFormChanged()) {
      throw new Error(
        'Tried to save changes but there were no changes. ' +
          'the save changes button is supposed to be disabled in this case',
      );
    }

    const articleId = this.props.params.id;

    const validationResult = await validateChanges(
      articleId,
      this.state,
      this.props.displayConfirm,
    );

    if (validationResult.invalid) {
      if (validationResult.msg) {
        await this.props.displayAlert(validationResult.msg);
      }
      return;
    }

    const { plainMarkdown, processedAuthors, processedTags } = validationResult;

    const jsonGraphEnvelope = buildJsonGraphEnvelope(
      this.state,
      articleId,
      plainMarkdown,
    );

    this.save(jsonGraphEnvelope, processedAuthors, processedTags, articleId);
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

  areTagsChanged(currentTags, falcorTags) {
    return !_.isEqual(currentTags, _.toArray(falcorTags));
  }

  isFormChanged() {
    const falcorData = this.state.data.articles.byId[this.props.params.id];
    const changedFlag =
      this.isFormFieldChanged(this.state.title, falcorData.title) ||
      this.isFormFieldChanged(this.state.slug, falcorData.slug) ||
      this.isFormFieldChanged(
        Plain.serialize(this.state.markdown),
        falcorData.markdown,
      ) ||
      this.isFormFieldChanged(this.state.teaser, falcorData.teaser) ||
      this.isFormFieldChanged(this.state.category, falcorData.category) ||
      this.isFormFieldChanged(this.state.imageUrl, falcorData.image_url) ||
      this.areAuthorsChanged(this.state.authors, falcorData.authors) ||
      this.areTagsChanged(this.state.tags, falcorData.tags);
    return changedFlag;
  }

  render() {
    const dialogActions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={() => this.setState({ open: false })}
      />,
    ];
    const styles = {
      grid: {
        display: 'grid',
        gridGap: '10px',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '5% 85% 10%',
        gridTemplateAreas:
          '"header header header" "content content content" "first second third"',
        height: '80vh',
        marginTop: '5vh',
        padding: '2vmax',
      },
      header: { gridArea: 'header' },
      first: { gridArea: 'first' },
      second: { gridArea: 'second' },
      third: { gridArea: 'third' },
      content: {
        background:
          'linear-gradient(to top, rgba(0, 0, 0, .2) 0%, rgba(0, 0, 0, 0) 2%)',
        display: 'flex',
        flexWrap: 'wrap',
        gridArea: 'content',
        justifyContent: 'space-between',
        overflowX: 'hidden',
        overflowY: 'scroll',
      },
      contentStyles: {
        twoThirds: { width: '65%' },
        oneThird: { width: '32%' },
        half: { width: '48.5%' },
        fullWidth: { width: '97%' },
      },
      helpText: {
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: '1vw',
      },
      buttons: {
        width: '100%',
      },
      exitButton: {
        float: 'right',
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
      categories.push({ name: 'none', id: null });

      const articleEditorID = 'article-editor';
      return (
        <Paper id={articleEditorID} style={styles.grid}>
          {this.state.saving ? <LoadingOverlay /> : null}

          <div style={styles.header}>
            <h2 style={{ display: 'inline' }}>Article Editor</h2>
            <span
              style={{
                color: 'rgba(0, 0, 0, 0.5)',
                fontSize: '0.8vw',
                marginLeft: '1vw',
              }}
              id="unpublished-text"
            >
              {article.published_at !== null
                ? `Published on ${moment(article.published_at).format(
                    'MMMM DD, YYYY',
                  )}.`
                : 'This article is not published'}
            </span>

            <FlatButton
              style={styles.exitButton}
              label="Return to List"
              labelPosition="before"
              icon={<ExitToApp />}
              onClick={this.returnToApp}
            />
          </div>
          <div style={styles.content}>
            <ShortRequiredTextField
              floatingLabelText="Title"
              style={styles.contentStyles.oneThird}
              value={this.state.title}
              onUpdate={this.updateTitle}
              disabled={this.state.saving}
            />
            <div style={styles.contentStyles.twoThirds}>
              <ShortRequiredTextField
                floatingLabelText="Slug"
                value={this.state.slug}
                onUpdate={this.updateSlug}
                disabled={this.state.saving || Boolean(article.published_at)}
                fullWidth
              />
              <br />
              <span style={styles.helpText}>
                {!article.published_at
                  ? ''
                  : 'You cannot edit the slug of a published article.'}
              </span>
            </div>
            <ListSelector
              label="Category"
              style={styles.contentStyles.oneThird}
              chosenElement={this.state.category}
              update={this.updateCategory}
              elements={categories}
              disabled={this.state.saving}
              fullWidth
            />
            <HttpsUrlField
              floatingLabelText="Image"
              style={styles.contentStyles.twoThirds}
              value={this.state.imageUrl}
              onUpdate={this.updateImage}
              disabled={this.state.saving}
              fullWidth
            />
            <MaxLenTextField
              name="teaser"
              style={styles.contentStyles.fullWidth}
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
              style={styles.contentStyles.half}
              fullWidth
            />
            <SearchableTagsSelector
              elements={this.state.tags}
              onChange={this.debouncedHandleFormStateChanges}
              onUpdate={this.updateTags}
              disabled={this.state.saving}
              mode="tags"
              style={styles.contentStyles.half}
              fullWidth
              enableAdd
            />
            <div style={styles.contentStyles.fullWidth}>
              <p
                style={{
                  color: 'rgba(0, 0, 0, 0.3)',
                  lineHeight: '22px',
                  fontSize: '12px',
                  marginTop: 0,
                  marginBottom: 10,
                }}
              >
                Article Content
              </p>
              <MarkdownEditor
                style={{ margin: '1%' }}
                onUpdate={this.updateMarkdown}
                value={this.state.markdown}
              />
            </div>
          </div>
          <div style={styles.first}>
            <UnpublishButton
              save={this.save}
              id={this.props.params.id}
              falcorUpdate={this.falcorUpdate}
              style={styles.buttons}
              published_at={article.published_at}
            />
          </div>
          <div style={styles.second}>
            <RaisedButton
              label="Preview"
              onClick={() => this.setState({ open: true })}
              style={styles.buttons}
            />
          </div>
          <div style={styles.third}>
            <SaveButton
              onClick={this.handleSaveChanges}
              style={styles.buttons}
              saving={this.state.saving}
              changed={this.state.changed}
            />
          </div>
          <Dialog
            title="Article Preview"
            actions={dialogActions}
            modal={false}
            open={this.state.open}
            autoScrollBodyContent
            onRequestClose={() => this.setState({ open: false })}
          >
            <ArticlePreview
              title={this.state.title}
              teaser={this.state.teaser}
              html={buildHtmlFromMarkdown(Plain.serialize(this.state.markdown))}
              authors={[{ slug: 'dummy', name: 'Dummy Author' }]}
              url="https://www.thegazelle.org/dummy/url"
              published_at={new Date().getTime()}
            />
          </Dialog>
        </Paper>
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
