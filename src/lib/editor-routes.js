import { Route, IndexRedirect } from 'react-router';
import React from 'react';
import EditorAppController from 'components/editor/EditorAppController';
import EditorArticleListController from 'components/editor/EditorArticleListController';
import EditorArticleController from 'components/editor/EditorArticleController';
import EditorAuthorListController from 'components/editor/EditorAuthorListController';
import EditorAuthorController from 'components/editor/EditorAuthorController';
import EditorIssueListController from 'components/editor/EditorIssueListController';
import EditorMainIssueController from 'components/editor/EditorMainIssueController';
import EditorIssueArticleController from 'components/editor/EditorIssueArticleController';
import EditorIssueCategoryController from 'components/editor/EditorIssueCategoryController';
import EditorNotFound from 'components/editor/EditorNotFound';
import EditorLogin from 'components/editor/EditorLogin';

export default (
  <Route path="/" component={EditorAppController}>
    <Route path="login" component={EditorLogin} />
    <IndexRedirect to="articles/page/1" />
    <Route path="articles/page/:page" component={EditorArticleListController}>
      <Route path="slug/:slug" component={EditorArticleController} />
    </Route>
    <Route path="authors/page/:page" component={EditorAuthorListController}>
      <Route path="slug/:slug" component={EditorAuthorController} />
    </Route>
    <Route path="issues(/:issueNumber)" component={EditorIssueListController}>
      <Route path="main" component={EditorMainIssueController} />
      <Route path="articles" component={EditorIssueArticleController} />
      <Route path="categories" component={EditorIssueCategoryController} />
    </Route>
    <Route path="*" component={EditorNotFound} />
  </Route>
);
