import BaseRouter from 'falcor-router';

import {
  articles,
  categories,
  infoPages,
  search,
  staff,
  issues,
  placeholder,
  teams,
  trending,
  semesters,
} from 'lib/falcor/routes';

export default class FalcorRouter extends BaseRouter.createClass(
  [].concat(
    articles,
    categories,
    infoPages,
    search,
    staff,
    issues,
    placeholder,
    teams,
    trending,
    semesters,
  ),
) {
  /* eslint-disable no-useless-constructor */
  constructor(...args) {
    super(...args);
  }
}
