/*
 * TextPageController is used to display the About and Ethics pages as pages
 * of only text. The text used is passed in dynamically after it is sourced from
 * the database.
 */

import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';

// Components
import TextPage from 'components/TextPage';
import NotFound from 'components/NotFound';

export default class TextPageController extends FalcorController {
  static getFalcorPathSets(params) {
    return [
      ["infoPages", params.slug, ["title", "html"]],
    ];
  }

  render() {
    if (this.state.ready) {
      if (this.state.data === null) {
        return (
          <NotFound />
        );
      } else {
        const data = this.state.data.infoPages[this.props.params.slug];
        return (
          <div>
            <TextPage title={data.title} html={data.html} />
          </div>
        );
      }
    } else {
      return (
        <div>
          Loading
        </div>
      );
    }
  }
}
