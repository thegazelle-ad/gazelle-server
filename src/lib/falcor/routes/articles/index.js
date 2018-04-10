import { routes as articlesByPageRoutes } from './by-page';
import bySlug from './by-slug';
import meta from './meta';

export default [].concat(articlesByPageRoutes, bySlug, meta);
