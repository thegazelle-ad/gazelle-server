import { Route } from 'react-router';
import React from 'react';
import AppController from 'components/AppController';
import PageController from 'components/PageController';
import ArticleController from 'components/ArticleController';
import AuthorController from 'components/AuthorController';

export default (
  <Route path="/" component={AppController}>
    <Route path="article/:articleId" component={ArticleController} />
    <Route path="author/:authorId" component={AuthorController} />
  </Route>
);
