import { routes as articlesByPageRoutes } from './by-page';
import bySlug from './by-slug';
import { routes as articlesMetaRoutes } from './meta';

export const articles = [].concat(
  articlesByPageRoutes,
  bySlug,
  articlesMetaRoutes,
);
