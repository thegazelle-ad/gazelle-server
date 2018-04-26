import { routes as articlesByPageRoutes } from './by-page';
import byId from './by-id';
import bySlug from './by-slug';
import { routes as articlesMetaRoutes } from './meta';

export const articles = [].concat(
  articlesByPageRoutes,
  byId,
  bySlug,
  articlesMetaRoutes,
);
