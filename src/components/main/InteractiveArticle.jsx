import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import Helmet from 'react-helmet';
import NotFound from 'components/main/NotFound';
import InteractiveArticleLoad from 'transitions/InteractiveArticleLoad';

export default class InteractiveArticle extends FalcorController {

  constructor(props) {
    super(props);
    this.safeSetState({
      didEval: false,
    });
  }

  static getFalcorPathSets(params) {
    return [
      // Fetch article metadata
      ['articles', 'bySlug', params.articleSlug,
        ['title', 'teaser', 'slug', 'image', 'published_at']],
      // Fetch interactive article html/js/css
      // For now we only use the html part, the js and css parts are for further improvements
      ['articles', 'bySlug', params.articleSlug, 'interactiveData',
        ['html', 'js', 'css']],
    ];
  }

  render() {
    if (this.state.ready) {
      if (!this.state.data) {
        return <NotFound />;
      }

      if (!this.state.didEval) {
        const articleData = this.state.data.articles.bySlug[this.props.params.articleSlug];

        // eslint-disable-next-line no-eval
        eval(articleData.interactiveData.js || '');

        this.safeSetState({ didEval: true });
      }

      const articleSlug = this.props.params.articleSlug;
      const publishDate = this.state.data.articles.bySlug[articleSlug].published_at;
      if (!publishDate) {
        return <NotFound />;
      }
      // Access data fetched via Falcor
      const articleData = this.state.data.articles.bySlug[articleSlug];
      const interactiveCode = articleData.interactiveData;
      // make sure article meta image has default
      const articleMetaImage = articleData.image || 'https://thegazelle.s3.amazonaws.com/gazelle/2016/02/saadiyat-reflection.jpg';
      const meta = [
        // Search results
        { name: 'description', content: articleData.teaser },

        // Social media sharing
        { property: 'og:title', content: `${articleData.title} | The Gazelle` },
        { property: 'og:type', content: 'article' },
        {
          property: 'og:url',
          content: `www.thegazelle.org/interactive/${articleData.slug}/`,
        },
        { property: 'og:image', content: articleMetaImage },
        { property: 'og:image:width', content: '540' }, // 1.8:1 ratio
        { property: 'og:image:height', content: '300' },
        { property: 'og:description', content: articleData.teaser },
        { property: 'og:site_name', content: 'The Gazelle' },
      ];
      const reactHtml = {
        __html: interactiveCode.html,
      };
      return (
        <div>
          <Helmet
            meta={meta}
            title={`${articleData.title} | The Gazelle`}
          />
          <div dangerouslySetInnerHTML={reactHtml} />
        </div>
      );
    }
    return <InteractiveArticleLoad />;
  }
}
