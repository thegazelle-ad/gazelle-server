import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';
import { updateFieldValue } from './lib/form-field-updaters';
import {
  hasNonHttpsURL,
  returnsFirstRelativeURL,
} from './lib/article-validators';
import moment from 'moment';
import { has, debounce } from 'lib/utilities';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

// HOCs
import { withModals } from 'components/admin/hocs/modals/withModals';

const styles = {
  paper: {
    height: '100%',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'left',
    display: 'inline-block',
  },
  tabs: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15,
  },
  buttons: {
    marginTop: 12,
    marginBottom: 24,
  },
  publishingButtons: {
    margin: 12,
  },
  nameField: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
};

const ARTICLE_FIELDS = ['title', 'teaser', 'image_url', 'slug', 'html'];
const AUTHOR_FIELDS = ['id', 'name', 'slug'];

class MainIssueController extends FalcorController {
  constructor(props) {
    super(props);
    this.publishIssue = this.publishIssue.bind(this);
    this.unpublishIssue = this.unpublishIssue.bind(this);
    this.fieldUpdaters = {
      name: updateFieldValue.bind(this, 'name', undefined),
      issueNumber: updateFieldValue.bind(this, 'issueNumber', undefined),
    };
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.safeSetState({
      publishing: false,
      name: '',
      issueNumber: '',
      published_at: null,
      changed: false,
      saving: false,
    });

    this.debouncedHandleFormStateChanges = debounce(() => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving || this.state.publishing) return;

      const changedFlag = this.isFormChanged();
      if (changedFlag !== this.state.changed) {
        this.safeSetState({ changed: changedFlag });
      }
    }, 500);

    this.handleDateChange = (event, date) => {
      this.safeSetState({ published_at: date });
    };
  }

  static getFalcorPathSets(params) {
    return [
      'issues',
      'byNumber',
      params.issueNumber,
      ['name', 'published_at', 'issueNumber'],
    ];
  }

  componentWillMount() {
    const falcorCallback = data => {
      const issue = data.issues.byNumber[this.props.params.issueNumber];
      const name = issue.name || '';
      const publishedAt = new Date(issue.published_at) || null;
      const issueNumber = issue.issueNumber || '';
      this.safeSetState({ name, published_at: publishedAt, issueNumber });
    };
    super.componentWillMount(falcorCallback);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallback = data => {
      const issue = data.issues.byNumber[nextProps.params.issueNumber];
      const name = issue.name || '';
      const publishedAt = new Date(issue.published_at) || null;
      const issueNumber = issue.issueNumber || '';
      this.safeSetState({ name, published_at: publishedAt, issueNumber });
    };
    super.componentWillReceiveProps(nextProps, undefined, falcorCallback);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.isSameIssue(prevProps, this.props) &&
      this.formHasUpdated(prevState, this.state) &&
      this.state.ready
    ) {
      // The update wasn't due to a change in issue
      this.debouncedHandleFormStateChanges();
    }
  }

  publishIssue() {
    const callback = () => {
      this.safeSetState({ publishing: false });
    };
    const falcorPathSets = [
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'categories',
        { length: 20 },
        'articles',
        { length: 50 },
        ARTICLE_FIELDS,
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'categories',
        { length: 20 },
        'articles',
        { length: 50 },
        'category',
        'slug',
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'categories',
        { length: 20 },
        'articles',
        { length: 50 },
        'authors',
        0,
        AUTHOR_FIELDS,
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'featured',
        ARTICLE_FIELDS,
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'featured',
        'category',
        'slug',
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'featured',
        'authors',
        0,
        AUTHOR_FIELDS,
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'picks',
        { length: 10 },
        ARTICLE_FIELDS,
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'picks',
        { length: 10 },
        'category',
        'slug',
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        'picks',
        { length: 10 },
        'authors',
        0,
        AUTHOR_FIELDS,
      ],
      [
        'issues',
        'byNumber',
        this.props.params.issueNumber,
        ['id', 'published_at', 'name'],
      ],
    ];
    this.props.model
      .get(...falcorPathSets)
      .then(async x => {
        if (!x) {
          this.props.displayAlert(
            'There was an error getting the issue data from the database ' +
              'please contact the developers',
          );
        } else {
          x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
          // Check validity of the issue before publishing it
          const { issueNumber } = this.props.params;
          const issue = x.json.issues.byNumber[issueNumber];
          const fields = ARTICLE_FIELDS.concat(['category.slug']);
          if (!issue.featured) {
            this.props.displayAlert('You need to add a featured article');
            return;
          }
          let allArticles = [issue.featured];
          allArticles = allArticles.concat(_.map(issue.picks, y => y));
          if (allArticles.length !== 3) {
            this.props.displayAlert(
              "you must have exactly 2 editor's picks in an issue",
            );
            return;
          }
          _.forEach(issue.categories, category => {
            const articles = _.toArray(category.articles);
            allArticles.push(...articles);
          });
          if (issue.published_at) {
            const shouldProcede = await this.props.displayConfirm(
              'This issue is already published, do you still wish to proceed changing it?',
            );
            if (!shouldProcede) {
              return;
            }
          }
          const articlesValid = allArticles.every(article => {
            const fieldsValid = fields.every(field => {
              if (!_.get(article, field)) {
                this.props.displayAlert(
                  `${article.title} has no ${field}. Please correct this`,
                );
                return false;
              }
              return true;
            });
            if (!fieldsValid) {
              return false;
            }
            if (!has.call(article, 'authors') || !article.authors[0]) {
              this.props.displayAlert(
                `${article.title} has no authors. Please correct this`,
              );
              return false;
            }
            if (hasNonHttpsURL(article.html)) {
              if (
                // TODO: Change this to this.props.displayAlert, it's just a bit finnicky
                // in the .every construct as described in IssueArticleController in a similar comment
                // eslint-disable-next-line no-alert
                !window.confirm(
                  `${article.title} has a non https link in it's body. ` +
                    'please make sure this link is not an image/video etc. being loaded in. ' +
                    'If you are sure of this press okay to continue, else cancel to check.',
                )
              ) {
                return false;
              }
            }
            const url = returnsFirstRelativeURL(article.html);
            if (url !== null) {
              if (
                // TODO: Change this to this.props.displayAlert, it's just a bit finnicky
                // in the .every construct as described in IssueArticleController in a similar comment
                // eslint-disable-next-line no-alert
                !window.confirm(
                  `The URL ${url} in the article ${
                    article.title
                  } is in non-absolute format, ` +
                    'which means that it does not have http(s):// in front of it, ' +
                    'which will break the link. ' +
                    'It will be misinterpreted and it will simply add the ' +
                    'link written to the end of the URL. ' +
                    'The easiest way to get a correct link is to copy it ' +
                    "from your browser's URL bar, remember to prefer https over http. " +
                    'Do you want to override our warning and continue publishing?',
                )
              ) {
                return false;
              }
            }
            return true;
          });
          if (!articlesValid) {
            return;
          }
          // The issue is valid, we can publish it
          this.safeSetState({ publishing: true });
          this.falcorCall(
            ['issues', 'byNumber', issueNumber, 'publishIssue'],
            [issue.id],
            undefined,
            undefined,
            undefined,
            callback,
          );
        }
      })
      .catch(e => {
        console.error(e); // eslint-disable-line no-console
        this.props.displayAlert(
          'There was an error getting the issue data from the database ' +
            'please contact the developers. The error message is in the developers console',
        );
      });
  }

  unpublishIssue() {
    const callback = () => {
      this.safeSetState({ publishing: false });
    };
    this.safeSetState({ publishing: true });
    this.falcorUpdate(
      {
        paths: [
          ['issues', 'byNumber', this.props.params.issueNumber, 'published_at'],
        ],
        jsonGraph: {
          issues: {
            byNumber: {
              [this.props.params.issueNumber]: {
                published_at: null,
              },
            },
          },
        },
      },
      undefined,
      callback,
    );
  }

  isFormFieldChanged(userInput, falcorData) {
    return userInput !== falcorData && !(!userInput && !falcorData);
  }

  isFormChanged() {
    const falcorData = this.state.data.issues.byNumber[
      this.props.params.issueNumber
    ];
    const changedFlag =
      this.isFormFieldChanged(this.state.name, falcorData.name) ||
      this.isFormFieldChanged(
        this.state.published_at.getTime(),
        falcorData.published_at,
      ) ||
      this.isFormFieldChanged(
        parseInt(this.state.issueNumber, 10),
        falcorData.issueNumber,
      );
    return changedFlag;
  }

  isSameIssue(prevProps, props) {
    return prevProps.params.issueNumber === props.params.issueNumber;
  }

  formHasUpdated(prevState, state) {
    return (
      this.isFormFieldChanged(prevState.name, state.name) ||
      this.isFormFieldChanged(prevState.published_at, state.published_at) ||
      this.isFormFieldChanged(prevState.issueNumber, state.issueNumber)
    );
  }

  async handleSaveChanges(event) {
    event.preventDefault();

    const { issueNumber } = this.props.params;
    const falcorData = this.state.data.issues.byNumber[issueNumber];
    const parsedIssueNumber = parseInt(this.state.issueNumber, 10);

    if (!this.isFormChanged()) {
      throw new Error(
        'Tried to save changes but there were no changes. ' +
          'the save changes button is supposed to be disabled in this case',
      );
    }

    if (this.isFormFieldChanged(parsedIssueNumber, falcorData.issueNumber)) {
      const shouldContinue = await this.props.displayConfirm(
        'You are about to change the issue number, ' +
          'which will change the URL to all articles in this issue, ' +
          'among other things. It is strongly recommended not to change the ' +
          'issue number unless it is very crucial. Are you sure you wish to proceed?',
      );
      if (!shouldContinue) {
        return;
      }
    }
    const resetState = () => {
      this.safeSetState({
        changed: false,
      });
      // This is purely so the 'saved' message can be seen by the user for a second
      setTimeout(() => {
        this.safeSetState({ saving: false });
      }, 1000);
    };

    // Build the jsonGraphEnvelope
    const jsonGraphEnvelope = {
      paths: [
        [
          'issues',
          'byNumber',
          issueNumber,
          ['published_at', 'name', 'issueNumber'],
        ],
      ],
      jsonGraph: {
        issues: {
          byNumber: {
            [issueNumber]: {},
          },
        },
      },
    };
    // Fill in the data
    jsonGraphEnvelope.jsonGraph.issues.byNumber[
      issueNumber
    ].published_at = this.state.published_at.getTime();
    jsonGraphEnvelope.jsonGraph.issues.byNumber[
      issueNumber
    ].name = this.state.name;
    jsonGraphEnvelope.jsonGraph.issues.byNumber[
      issueNumber
    ].issueNumber = parsedIssueNumber;
    // Update the values
    this.falcorUpdate(jsonGraphEnvelope, undefined, resetState);
    this.safeSetState({ saving: true });
  }

  disableDate(date) {
    return moment(date) > moment();
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data || !this.state.data.issues) {
        return <p>This issue does not exist</p>;
      }
      const published = Boolean(
        this.state.data.issues.byNumber[this.props.params.issueNumber]
          .published_at,
      );

      let changedStateMessage;
      if (!this.state.changed) {
        if (!this.state.saving) {
          changedStateMessage = 'No Changes';
        } else {
          changedStateMessage = 'Saved';
        }
      } else if (!this.state.saving) {
        changedStateMessage = 'Save Changes';
      } else {
        changedStateMessage = 'Saving';
      }

      return (
        <div style={styles.tabs}>
          <form onSubmit={this.handleSaveChanges}>
            <TextField
              name="name"
              type="text"
              floatingLabelText="Issue Name"
              value={this.state.name}
              style={styles.nameField}
              onChange={this.fieldUpdaters.name}
              disabled={this.state.saving || this.state.publishing}
              fullWidth
            />
            <br />
            <TextField
              name="number"
              floatingLabelText="Issue Number"
              value={this.state.issueNumber}
              onChange={this.fieldUpdaters.issueNumber}
              disabled
            />
            <br />
            <DatePicker
              disabled={
                !published || this.state.saving || this.state.publishing
              }
              floatingLabelText="Published At"
              firstDayOfWeek={0}
              shouldDisableDate={this.disableDate}
              value={this.state.published_at}
              onChange={this.handleDateChange}
            />
            <br />
            <RaisedButton
              type="submit"
              label={changedStateMessage}
              primary
              style={styles.buttons}
              disabled={
                !this.state.changed ||
                this.state.saving ||
                this.state.publishing
              }
            />
          </form>
          <br />
          <RaisedButton
            label={!published ? 'Publish Issue' : 'Issue Published'}
            primary
            style={styles.publishingButtons}
            onTouchTap={this.publishIssue}
            disabled={
              published ||
              this.state.changed ||
              this.state.saving ||
              this.state.publishing
            }
          />
          <RaisedButton
            label={published ? 'Unpublish Issue' : 'Issue Not Published'}
            secondary
            style={styles.publishingButtons}
            onTouchTap={this.unpublishIssue}
            disabled={
              !published ||
              this.state.changed ||
              this.state.saving ||
              this.state.publishing
            }
          />
          {this.state.publishing ? <h4>Publishing...</h4> : null}
        </div>
      );
    }
    return (
      <div className="circular-progress">
        <CircularProgress />
      </div>
    );
  }
}

const EnhancedMainIssueController = withModals(MainIssueController);
export { EnhancedMainIssueController as MainIssueController };
