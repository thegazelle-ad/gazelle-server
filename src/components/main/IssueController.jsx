// Render article preview data as all articles from respective issue
// Parents: AppController
// Children: ArticleList

import React from 'react';
import _ from 'lodash';
import FalcorController from 'lib/falcor/FalcorController';
import { Link } from 'react-router';
import Helmet from 'react-helmet'; // Add meta tags for pre-Ghost release
import { mapLegacyIssueSlugsToIssueNumber } from 'lib/utilities';

// Import components
import FeaturedArticle from 'components/main/FeaturedArticle';
import EditorsPicks from 'components/main/EditorsPicks';
import Trending from 'components/main/Trending';
import ArticleList from 'components/main/ArticleList';
import MailingListButton from 'components/main/MailingListButton';
import NotFound from 'components/main/NotFound';

export default class IssueController extends FalcorController {
  static getFalcorPathSets(params) {
    // URL Format: thegazelle.org/issue/:issueNumber/:articleCategory/:articleSlug

    // Conditional return allows The Gazelle to return the correct issue
    // User is either requesting the 'issues', 'latest' on the home page or an
    // old issue.
    const articleFields = [
      'title',
      'teaser',
      'issueNumber',
      'category',
      'slug',
      'image_url',
      'is_interactive',
    ];
    const authorFields = ['name', 'slug'];
    const issueFields = ['issueNumber', 'published_at'];
    const categoryFields = ['name', 'slug'];
    if (params.issueNumber) {
      // If not on home page grab specificed issue
      const issueNumber = mapLegacyIssueSlugsToIssueNumber(params.issueNumber);
      return [
        ['issues', 'byNumber', issueNumber, issueFields],

        // Request the featured article
        ['issues', 'byNumber', issueNumber, 'featured', articleFields],
        [
          'issues',
          'byNumber',
          issueNumber,
          'featured',
          'authors',
          { length: 10 },
          authorFields,
        ],

        // Request first two Editor's Picks
        [
          'issues',
          'byNumber',
          issueNumber,
          'picks',
          { length: 2 },
          articleFields,
        ],
        [
          'issues',
          'byNumber',
          issueNumber,
          'picks',
          { length: 2 },
          'authors',
          { length: 10 },
          authorFields,
        ],

        // Request first five Trending articles
        ['trending', { length: 6 }, articleFields],
        ['trending', { length: 6 }, 'authors', { length: 10 }, authorFields],

        // Request all category names and slugs (max 10 categories)
        [
          'issues',
          'byNumber',
          issueNumber,
          'categories',
          { length: 10 },
          categoryFields,
        ],

        // Request necessary data from all articles from each category (max 30 articles)
        [
          'issues',
          'byNumber',
          issueNumber,
          'categories',
          { length: 10 },
          'articles',
          { length: 30 },
          articleFields,
        ],

        // Request author name and slug for each article (max 10 authors)
        [
          'issues',
          'byNumber',
          issueNumber,
          'categories',
          { length: 10 },
          'articles',
          { length: 30 },
          'authors',
          { length: 10 },
          authorFields,
        ],
      ];
    }
    // User is on home page
    return [
      ['issues', 'latest', issueFields],

      // Request the featured article
      ['issues', 'latest', 'featured', articleFields],
      ['issues', 'latest', 'featured', 'authors', { length: 10 }, authorFields],

      // Request first two Editor's Picks
      ['issues', 'latest', 'picks', { length: 2 }, articleFields],
      [
        'issues',
        'latest',
        'picks',
        { length: 2 },
        'authors',
        { length: 10 },
        authorFields,
      ],

      // Request first five Trending articles
      ['trending', { length: 6 }, articleFields],
      ['trending', { length: 6 }, 'authors', { length: 10 }, authorFields],

      // Request all category names and slugs (max 10 categories)
      ['issues', 'latest', 'categories', { length: 10 }, categoryFields],

      // Request necessary data from all articles from each category (max 30 articles)
      [
        'issues',
        'latest',
        'categories',
        { length: 10 },
        'articles',
        { length: 30 },
        articleFields,
      ],

      // Request author name and slug for each article (max 10 authors)
      [
        'issues',
        'latest',
        'categories',
        { length: 10 },
        'articles',
        { length: 30 },
        'authors',
        { length: 10 },
        authorFields,
      ],
    ];
  }

  render() {
    if (this.state.ready) {
      if (
        !this.state.data ||
        !this.state.data.issues ||
        (this.props.params.issueNumber && !this.state.data.issues.byNumber)
      ) {
        return <NotFound />;
      }
      let issueData;
      if (!this.props.params.issueNumber) {
        issueData = this.state.data.issues.latest;
      } else {
        issueData = this.state.data.issues.byNumber[
          mapLegacyIssueSlugsToIssueNumber(this.props.params.issueNumber)
        ];
      }
      const trendingData = _.toArray(this.state.data.trending);
      /*
       * Category object structure:
       * {
       *   name: "category name",
       *   slug: "category-slug",
       *   articles: {
       *     ...
       *   }
       * }
       */
      const renderCategories =
        // Render nothing if this.props.articles is empty
        _.map(issueData.categories || [], category => (
          <div key={category.name} className="issue__category">
            <Link to={`/category/${category.slug}`}>
              <h2 className="section-header">{category.name}</h2>
            </Link>
            <ArticleList articles={_.toArray(category.articles)} />
          </div>
        ));

      // Make sure issueImage has a default
      const issueImage =
        issueData.featured.image_url ||
        'https://thegazelle.s3.amazonaws.com/gazelle/2016/02/saadiyat-reflection.jpg';

      const meta = [
        // Search results
        {
          name: 'description',
          content:
            'The Gazelle is a weekly student publication, serving the ' +
            'NYU Abu Dhabi community and the greater Global Network University at NYU.',
        },

        // Social media
        {
          property: 'og:title',
          content: `Issue ${issueData.issueNumber} | The Gazelle`,
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'www.thegazelle.org' },
        { property: 'og:image', content: issueImage },
        {
          property: 'og:description',
          content:
            'The Gazelle is a weekly student publication ' +
            'serving the NYU Abu Dhabi community.',
        },
      ];
      // Top level elements can't have classes or it will break transitions
      return (
        <div>
          <Helmet meta={meta} title="The Gazelle | NYU Abu Dhabi News" />
          <div className="issue">
            <FeaturedArticle article={issueData.featured} />
            <div className="top-articles">
              <EditorsPicks articles={_.toArray(issueData.picks)} />
              <Trending articles={trendingData} />
            </div>
            {renderCategories}
            <MailingListButton />
          </div>
        </div>
      );
    }
    return <div>Loading</div>;
  }
}

IssueController.propTypes = {
  issue: React.PropTypes.shape({
    published_at: React.PropTypes.string,
    articles: React.PropTypes.object,
  }),
};
