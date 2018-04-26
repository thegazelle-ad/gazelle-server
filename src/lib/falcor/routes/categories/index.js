import { routes as byIndex } from './by-index';
import { routes as bySlug } from './by-slug';
import { routes as byId } from './by-id';

export const categories = [].concat(byIndex, bySlug, byId);
