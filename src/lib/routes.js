import { Route, IndexRoute } from 'react-router';
import React from 'react';
import AppController from 'components/AppController';
import PageController from 'components/PageController';
import ArticleController from 'components/ArticleController';
import AuthorController from 'components/AuthorController';
import IssueController from 'components/IssueController';

// <Route path="issue/:issueId/:category/:articleSlug" component={ArticleController} />

export default (
  <Route path="/" component={AppController}>
    <Route path="issue/:issueId/:articleCategory/:articleSlug" component={ArticleController} />
    <Route path="author/:authorSlug" component={AuthorController} />
    <IndexRoute component={IssueController} />
  </Route>
);
