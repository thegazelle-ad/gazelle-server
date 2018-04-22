import byIndex from './by-index';
import bySlug from './by-slug';
import { routes as byId } from './by-id';

export default [].concat(byIndex, bySlug, byId);
