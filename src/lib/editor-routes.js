import { Route, IndexRedirect } from 'react-router';
import React from 'react';
import EditorAppController from 'components/editor/EditorAppController';
import EditorArticleListController from 'components/editor/EditorArticleListController';
import EditorArticleController from 'components/editor/EditorArticleController';
import EditorAuthorListController from 'components/editor/EditorAuthorListController';
import EditorAuthorController from 'components/editor/EditorAuthorController';

export default (
  <Route path="/" component={EditorAppController}>
    <IndexRedirect to="articles/page/1" />
    <Route path="articles/page/:page" component={EditorArticleListController}>
      <Route path="slug/:slug" component={EditorArticleController} />
    </Route>
    <Route path="authors/page/:page" component={EditorAuthorListController}>
      <Route path="slug/:slug" component={EditorAuthorController} />
    </Route>
  </Route>
);
