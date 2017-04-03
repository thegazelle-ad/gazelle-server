import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';

// material-ui
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';

export default class EditorMainIssueController extends FalcorController {
  constructor(props) {
    super(props);
    this.publishIssue = this.publishIssue.bind(this);
    this.unpublishIssue = this.unpublishIssue.bind(this);
    this.safeSetState({
      publishing: false,
    });
  }
  static getFalcorPathSets(params) {
    return ['issuesByNumber', params.issueNumber, 'published_at'];
  }

  publishIssue() {
    const callback = () => {
      this.safeSetState({publishing: false});
      // window.alert("Issue successfully published");
    }
    const falcorPathSets = [
      ['issuesByNumber', this.props.params.issueNumber, 'categories', {length: 20}, 'articles', {length: 50}, ['title', 'teaser', 'category', 'html']],
      ['issuesByNumber', this.props.params.issueNumber, 'categories', {length: 20}, 'articles', {length: 50}, 'authors', 0],
      ['issuesByNumber', this.props.params.issueNumber, ['id', 'published_at', 'name']],
    ];
    this.props.model.get(...falcorPathSets).then((x) => {
      if (!x) {
        window.alert("There was an error getting the issue data from the database " +
          "please contact the developers");
      }
      else {
        // Check validity of the issue before publishing it
        const issueNumber = this.props.params.issueNumber;
        const issue = x.json.issuesByNumber[issueNumber];
        const fields = falcorPathSets[0][falcorPathSets[0].length-1].filter((field) => {
          return field !== 'title';
        });
        if (issue.published_at) {
          if (!window.confirm("This article is already published, do you want to republish it?")) {
            return;
          }
        }
        const valid = _.every(issue.categories, (category) => {
          return _.every(category.articles, (article) => {
            const valid = fields.every((field) => {
              if (!article[field]) {
                window.alert(article.title + " has no " + field + ". Please correct this");
                return false;
              }
              return true;
            });
            if (!valid) {
              return false;
            }
            if (!article.hasOwnProperty('authors') || !article.authors[0]) {
              window.alert(article.title + " has no authors. Please correct this");
              return false;
            }
            if (/http(?!s)/.test(article.html)) {
              if (!window.confirm(article.title + " has a non https link in it's body. " +
                " please make sure this link is not an image/video etc. being loaded in. " +
                " If you are sure of this press okay to continue, else cancel to check.")) {
                return false;
              }
            }
            return true;
          });
        });
        if (!valid) {
          return;
        }
        // The issue is valid, we can publish it
        this.safeSetState({publishing: true});
        this.falcorCall(['issuesByNumber', issueNumber, 'publishIssue'],
          [issue.id], undefined, undefined, undefined, callback);
      }
    })
    .catch((e) => {
      console.error(e); // eslint-disable-line no-console
      window.alert("There was an error getting the issue data from the database " +
        "please contact the developers. The error message is in the developers console");
    })
  }

  unpublishIssue() {
    const callback = () => {
      this.safeSetState({publishing: false});
      // window.alert("Issue succesfully unpublished");
    }
    this.safeSetState({publishing: true});
    this.falcorUpdate({
      paths: [['issuesByNumber', this.props.params.issueNumber, 'published_at']],
      jsonGraph: {
        issuesByNumber: {
          [this.props.params.issueNumber]: {
            published_at: null,
          },
        },
      },
    }, undefined, callback);
  }

  render() {
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
      circularProgress: {
        height: 150,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    }

    if (this.state.ready) {
      if (!this.state.data) {
        return <p>This issue does not exist</p>;
      }
      const published = this.state.data.issuesByNumber[this.props.params.issueNumber].published_at ? true : false;
      return (
        <div style={styles.tabs}>
          <RaisedButton
            label={
              !published
              ? "Publish Issue"
              : "Issue Published"
            }
            primary
            style={styles.publishingButtons}
            onTouchTap={this.publishIssue}
            disabled={published}
          />
          <RaisedButton
            label={
              published
              ? "Unpublish Issue"
              : "Issue Not Published"
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
    else {
      return (
        <div style={styles.circularProgress}>
          <CircularProgress />;
        </div>
      );
    }
  }
}
