import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';
import { updateFieldValue } from './lib/form-field-updaters';
import { debounce } from 'lib/utilities';
import moment from 'moment';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';

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

const ARTICLE_FIELDS = ['title', 'teaser', 'category', 'image', 'slug', 'html'];
const AUTHOR_FIELDS = ['id', 'name', 'slug'];

export default class MainIssueController extends FalcorController {
  constructor(props) {
    super(props);
    this.publishIssue = this.publishIssue.bind(this);
    this.unpublishIssue = this.unpublishIssue.bind(this);
    this.fieldUpdaters = {
      name: updateFieldValue.bind(this, 'name', undefined),
    };
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.safeSetState({
      publishing: false,
      name: '',
      published_at: null,
      changed: false,
      saving: false,
    });

    this.debouncedHandleFormStateChanges = debounce(() => {
      // We don't want the debounced event to happen if we're saving
      if (this.state.saving) return;

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
    return ['issues', 'byNumber', params.issueNumber, ['name', 'published_at']];
  }

  componentWillMount() {
    const falcorCallback = (data) => {
      const name = data.issues.byNumber[this.props.params.issueNumber].name || '';
      const publishedAt =
        new Date(data.issues.byNumber[this.props.params.issueNumber].published_at) || null;
      this.safeSetState({ name, published_at: publishedAt });
    };
    super.componentWillMount(falcorCallback);
  }

  componentWillReceiveProps(nextProps) {
    const falcorCallback = (data) => {
      const name = data.issues.byNumber[nextProps.params.issueNumber].name || '';
      const publishedAt =
        new Date(data.issues.byNumber[nextProps.params.issueNumber].published_at) || null;
      this.safeSetState({ name, published_at: publishedAt });
    };
    super.componentWillReceiveProps(nextProps, undefined, falcorCallback);
    this.safeSetState({
      changed: false,
      saving: false,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.isSameIssue(prevProps, this.props) &&
        this.formHasUpdated(prevState, this.state) &&
        this.state.ready) {
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
        'issues', 'byNumber',
        this.props.params.issueNumber,
        'categories',
        { length: 20 },
        'articles',
        { length: 50 },
        ARTICLE_FIELDS,
      ],
      [
        'issues', 'byNumber',
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
        'issues', 'byNumber',
        this.props.params.issueNumber,
        'featured',
        ARTICLE_FIELDS,
      ],
      [
        'issues', 'byNumber',
        this.props.params.issueNumber,
        'featured',
        'authors',
        0,
        AUTHOR_FIELDS,
      ],
      [
        'issues', 'byNumber',
        this.props.params.issueNumber,
        'picks',
        { length: 10 },
        ARTICLE_FIELDS,
      ],
      [
        'issues', 'byNumber',
        this.props.params.issueNumber,
        'picks',
        { length: 10 },
        'authors',
        0,
        AUTHOR_FIELDS,
      ],
      ['issues', 'byNumber', this.props.params.issueNumber, ['id', 'published_at', 'name']],
    ];
    this.props.model.get(...falcorPathSets).then((x) => {
      if (!x) {
        window.alert('There was an error getting the issue data from the database ' +
          'please contact the developers');
      } else {
        x = cleanupFalcorKeys(x); // eslint-disable-line no-param-reassign
        // Check validity of the issue before publishing it
        const issueNumber = this.props.params.issueNumber;
        const issue = x.json.issues.byNumber[issueNumber];
        const fields = ARTICLE_FIELDS;
        if (!issue.featured) {
          window.alert('You need to add a featured article');
          return;
        }
        let allArticles = [issue.featured];
        allArticles = allArticles.concat(_.map(issue.picks, y => y));
        if (allArticles.length !== 3) {
          window.alert('you must have exactly 2 editor\'s picks in an issue');
          return;
        }
        _.forEach(issue.categories, category => (
          allArticles = allArticles.concat(_.map(category.articles, y => y))
        ));
        if (issue.published_at) {
          if (!window.confirm('This article is already published, do you want to republish it?')) {
            return;
          }
        }
        const articlesValid = allArticles.every(article => {
          const fieldsValid = fields.every((field) => {
            if (!article[field]) {
              window.alert(`${article.title} has no ${field}. Please correct this`);
              return false;
            }
            return true;
          });
          if (!fieldsValid) {
            return false;
          }
          if (!article.hasOwnProperty('authors') || !article.authors[0]) {
            window.alert(`${article.title} has no authors. Please correct this`);
            return false;
          }
          if (/http(?!s)/.test(article.html)) {
            if (!window.confirm(
                `${article.title} has a non https link in it's body. ` +
                'please make sure this link is not an image/video etc. being loaded in. ' +
                'If you are sure of this press okay to continue, else cancel to check.'
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
        this.falcorCall(['issues', 'byNumber', issueNumber, 'publishIssue'],
          [issue.id], undefined, undefined, undefined, callback);
      }
    })
    .catch((e) => {
      console.error(e); // eslint-disable-line no-console
      window.alert('There was an error getting the issue data from the database ' +
        'please contact the developers. The error message is in the developers console');
    });
  }

  unpublishIssue() {
    const callback = () => {
      this.safeSetState({ publishing: false });
    };
    this.safeSetState({ publishing: true });
    this.falcorUpdate({
      paths: [['issues', 'byNumber', this.props.params.issueNumber, 'published_at']],
      jsonGraph: {
        issues: {
          byNumber: {
            [this.props.params.issueNumber]: {
              published_at: null,
            },
          },
        },
      },
    }, undefined, callback);
  }

  isFormFieldChanged(userInput, falcorData) {
    return ((userInput !== falcorData) && !(!userInput && !falcorData));
  }

  isFormChanged() {
    const falcorData = this.state.data.issues.byNumber[this.props.params.issueNumber];
    const publishedAt = moment(this.state.published_at).valueOf();
    const changedFlag =
      this.isFormFieldChanged(this.state.name, falcorData.name) ||
      this.isFormFieldChanged(publishedAt, falcorData.published_at);
    return changedFlag;
  }

  isSameIssue(prevProps, props) {
    return prevProps.params.issueNumber === props.params.issueNumber;
  }

  formHasUpdated(prevState, state) {
    return (this.isFormFieldChanged(prevState.name, state.name) ||
      this.isFormFieldChanged(prevState.published_at, state.published_at));
  }

  handleSaveChanges(event) {
    event.preventDefault();

    const issueNumber = this.props.params.issueNumber;

    if (!this.isFormChanged()) {
      throw new Error(
        'Tried to save changes but there were no changes. ' +
        'the save changes button is supposed to be disabled in this case'
      );
    }

    const resetState = () => {
      this.safeSetState({
        changed: false,
      });
      // This is purely so the 'saved' message can be seen by the user for a second
      setTimeout(() => { this.safeSetState({ saving: false }); }, 1000);
    };

    // Build the jsonGraphEnvelope
    const jsonGraphEnvelope = {
      paths: [
        ['issues', 'byNumber', issueNumber, 'name'],
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
    jsonGraphEnvelope.jsonGraph.issues.byNumber[issueNumber].name = this.state.name;
    // jsonGraphEnvelope.jsonGraph.issues.byNumber[issueNumber].published_at =
    // this.state.published_at;
    // Update the values
    this.falcorUpdate(jsonGraphEnvelope, undefined, resetState);
    this.safeSetState({ saving: true });
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <p>This issue does not exist</p>;
      }
      const published = Boolean(
        this.state.data.issues.byNumber[this.props.params.issueNumber].published_at
      );

      let changedStateMessage;
      if (!this.state.changed) {
        if (!this.state.saving) {
          changedStateMessage = 'No Changes';
        } else {
          changedStateMessage = 'Saved';
        }
      } else {
        if (!this.state.saving) {
          changedStateMessage = 'Save Changes';
        } else {
          changedStateMessage = 'Saving';
        }
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
              fullWidth
            />
            <br />
            <DatePicker
              floatingLabelText="Published At"
              firstDayOfWeek={0}
              value={this.state.published_at}
              onChange={this.handleDateChange}
              disabled={!published}
            />
            <br />
            <RaisedButton
              type="submit"
              label={changedStateMessage}
              primary
              style={styles.buttons}
              disabled={!this.state.changed || this.state.saving}
            />
          </form>
          <br />
          <RaisedButton
            label={
              !published
              ? 'Publish Issue'
              : 'Issue Published'
            }
            primary
            style={styles.publishingButtons}
            onTouchTap={this.publishIssue}
            disabled={published || this.state.changed || this.state.saving}
          />
          <RaisedButton
            label={
              published
              ? 'Unpublish Issue'
              : 'Issue Not Published'
            }
            secondary
            style={styles.publishingButtons}
            onTouchTap={this.unpublishIssue}
            disabled={!published || this.state.changed || this.state.saving}
          />
          {this.state.publishing
          ? <h4>Publishing...</h4>
          : null
          }
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
