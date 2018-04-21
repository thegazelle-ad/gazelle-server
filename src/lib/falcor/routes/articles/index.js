import { routes as articlesByPageRoutes } from './by-page';
import bySlug from './by-slug';
import byId from './by-id';
import meta from './meta';

export default [].concat(articlesByPageRoutes, bySlug, byId, meta);
