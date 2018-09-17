/*
 * TextPageController is used to display the About and Ethics pages as pages
 * of only text. The text used is passed in dynamically after it is sourced from
 * the database.
 */

import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from 'react-helmet'; // Add meta tags for pre-Ghost release

// Components
import TextPage from 'components/main/TextPage';
import NotFound from 'components/main/NotFound';
import TextPageLoad from 'transitions/TextPageLoad';

const uppercase = str => {
  const array = str.split(' ');
  const newArray = [];

  for (let x = 0; x < array.length; x++) {
    newArray.push(array[x].charAt(0).toUpperCase() + array[x].slice(1));
  }
  return newArray.join(' ');
};

export default class TextPageController extends FalcorController {
  static getFalcorPathSets(params) {
    return [['infoPages', params.slug, ['title', 'html', 'slug']]];
  }

  static getOpenGraphInformation(urlParams, falcorData) {
    const data = falcorData.infoPages[urlParams.slug];
    return [
      {
        property: 'og:title',
        content: `${uppercase(data.title)} | The Gazelle`,
      },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:url',
        content: `https://www.thegazelle.org/${data.slug}`,
      },
      {
        property: 'og:image',
        content:
          'https://www.thegazelle.org/wp-content/themes/gazelle/images/gazelle_logo.png',
      },
      {
        property: 'og:description',
        content:
          'The Gazelle is a weekly student publication ' +
          'serving the NYU Abu Dhabi community.',
      },
    ];
  }

  render() {
    if (this.state.ready) {
      if (
        this.state.data === null ||
        Object.keys(this.state.data).length === 0
      ) {
        return <NotFound />;
      }
      const data = this.state.data.infoPages[this.props.params.slug];
      const meta = [
        // Search results
        {
          name: 'description',
          content:
            'The Gazelle is a weekly student publication, serving the ' +
            'NYU Abu Dhabi community and the greater Global Network University at NYU.',
        },

        // Social media
        ...TextPageController.getOpenGraphInformation(
          this.props.params,
          this.state.data,
        ),
      ];
      return (
        <div>
          <Helmet
            meta={meta}
            title={`${uppercase(data.title)} | The Gazelle`}
          />
          <TextPage title={data.title} html={data.html} />
        </div>
      );
    }
    return <TextPageLoad />;
  }
}
