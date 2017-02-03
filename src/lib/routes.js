import { Route, IndexRoute } from 'react-router';
import React from 'react';
import AppController from 'components/AppController';
import ArticleController from 'components/ArticleController';
import ArchivesController from 'components/ArchivesController';
import AuthorController from 'components/AuthorController';
import IssueController from 'components/IssueController';
import CategoryController from 'components/CategoryController';
import TextPageController from 'components/TextPageController';
import TeamPageController from 'components/TeamPageController';
import NotFoundController from 'components/NotFoundController';
import SearchController from 'components/SearchController';
import Login from 'components/Login';

export default (
  <Route path="/" component={AppController}>
    <Route path="login" component={Login} />
    <Route path="issue/:issueNumber/:articleCategory/:articleSlug" component={ArticleController} />
    <Route path="author/:authorSlug" component={AuthorController} />
    <Route path="issue/:issueNumber" component={IssueController} />
    <Route path="category/:category" component={CategoryController} />
    <Route path="archives" component={ArchivesController} />
    <Route path="team" component={TeamPageController} />
    <Route path="search" component={SearchController} />
    <Route path=":slug" component={TextPageController} />
    <Route path="*" component={NotFoundController} />
    <IndexRoute component={IssueController} />
  </Route>
);
