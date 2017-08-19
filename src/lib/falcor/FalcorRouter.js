import BaseRouter from 'falcor-router';

import {
  articles,
  categories,
  infoPages,
  latestIssue,
  search,
  totalAmountOfArticles,
  authors,
  issues,
  placeholder,
  teams,
  trending,
} from 'lib/falcor/routes';

export default class FalcorRouter extends BaseRouter.createClass(
  [].concat(
    articles,
    categories,
    infoPages,
    latestIssue,
    search,
    totalAmountOfArticles,
    authors,
    issues,
    placeholder,
    teams,
    trending
  )
) {
  /* eslint-disable no-useless-constructor */
  constructor() {
    super();
  }
}
