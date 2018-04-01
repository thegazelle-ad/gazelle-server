/* eslint-disable react/jsx-filename-extension */
import { Route, IndexRoute } from 'react-router';
import React from 'react';

import InteractiveArticle from 'components/main/InteractiveArticle';
import AppController from 'components/main/AppController';
import ArticleController from 'components/main/ArticleController';
import ArchivesController from 'components/main/ArchivesController';
import StaffMemberController from 'components/main/StaffMemberController';
import IssueController from 'components/main/IssueController';
import CategoryController from 'components/main/CategoryController';
import TextPageController from 'components/main/TextPageController';
import TeamPageController from 'components/main/TeamPageController';
import NotFoundController from 'components/main/NotFoundController';
import SearchController from 'components/main/SearchController';

export default [
  <Route path="/interactive/:articleSlug" component={InteractiveArticle} />,
  <Route path="/" component={AppController}>
    {/** LEGACY ROUTES BEGIN */}
    <Route path="author/:staffSlug" component={StaffMemberController} />
    {/** LEGACY ROUTES END */}
    <Route
      path="issue/:issueNumber/:articleCategory/:articleSlug"
      component={ArticleController}
    />
    <Route path="staff-member/:staffSlug" component={StaffMemberController} />
    <Route path="issue/:issueNumber" component={IssueController} />
    <Route path="category/:category" component={CategoryController} />
    <Route path="archives" component={ArchivesController} />
    <Route path="team" component={TeamPageController} />
    <Route path="search" component={SearchController} />
    <Route path=":slug" component={TextPageController} />
    <Route path="*" component={NotFoundController} />
    <IndexRoute component={IssueController} />
  </Route>,
];
