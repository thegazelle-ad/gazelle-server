import React from 'react';
import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  render () {
    let article = this.props.article;

    // Render all contributing authors
    function renderAuthors() {
      // Return nothing if no authors listed
      let data = [];
      if (article.authors){
        for (var author in article.authors){
          if (article.authors.hasOwnProperty(author)) {
            data.push(
              <div key={article.authors[author].slug}>
                <Link to={'/author/' + article.authors[author].slug}>
                  {article.authors[author].name}
                </Link>
              </div>
            );
          }
        }
      }
      return data;
    }
    return (
      <div>
        {/*
          Featured image
          TODO: change article image path before release
          <img src={article.image} alt="featured" />
        */}

        {/* Author(s) */}
        {renderAuthors()}

        {/*
          Article title with link to article
        */}
        <Link to={'/issue/' + article.issueId + '/' + article.category + '/' + article.slug}>
          {article.title}
        </Link>

        {/* Article teaser */}
        <p>{article.teaser}</p>
      </div>
    );
  }
}

// Validate shape of article JSON object
ArticlePreview.propTypes = {
  article: React.PropTypes.shape({
    title: React.PropTypes.string.isRequired,
    teaser: React.PropTypes.string.isRequired,
    issueId: React.PropTypes.string.isRequired,
    category: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    authors: React.PropTypes.object,
  }),
}
