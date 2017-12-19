/*
 * NotFoundController simply renders the NotFound component. This controller is
 * necessary for transitions. Without it, the component will not recieve the
 * function visibleTransitionOut and the page will transition will fail.
 */

import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';

// Components
import NotFound from 'components/main/NotFound';

export default class NotFoundController extends FalcorController {
  static getFalcorPathSets() {
    return [];
  }

  render() {
    if (this.state.ready) {
      return (
        <div>
          <NotFound />
        </div>
      );
    }
    return <div>Loading</div>;
  }
}
