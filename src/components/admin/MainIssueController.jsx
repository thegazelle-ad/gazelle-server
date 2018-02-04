import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import { cleanupFalcorKeys } from 'lib/falcor/falcor-utilities';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

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
};

const ARTICLE_FIELDS = ['title', 'teaser', 'category', 'image', 'slug', 'html'];
const AUTHOR_FIELDS = ['id', 'name', 'slug'];

export default class MainIssueController extends FalcorController {
  constructor(props) {
    super(props);
    this.publishIssue = this.publishIssue.bind(this);
    this.unpublishIssue = this.unpublishIssue.bind(this);
    this.safeSetState({
      publishing: false,
    });
  }
  static getFalcorPathSets(params) {
    return ['issues', 'byNumber', params.issueNumber, 'published_at'];
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

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <p>This issue does not exist</p>;
      }
      const published = Boolean(
        this.state.data.issues.byNumber[this.props.params.issueNumber].published_at
      );
      return (
        <div style={styles.tabs}>
          <RaisedButton
            label={
              !published
              ? 'Publish Issue'
              : 'Issue Published'
            }
            primary
            style={styles.publishingButtons}
            onTouchTap={this.publishIssue}
            disabled={published}
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
            disabled={!published}
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
