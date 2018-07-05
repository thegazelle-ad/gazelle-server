import { gazelleRender } from './gazelle-render';
import { gazelleDecorate } from './gazelle-decorate';

export const GazellePlugin = () => ({
  decorateNode: gazelleDecorate,
  renderMark: gazelleRender,
});
