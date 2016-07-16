import React from 'react';
import { Link } from 'react-router';

export default class ArticlePreview extends React.Component {

  render () {
    // Render all contributing authors
    // function renderAuthors() {
    //   // Return nothing if no authors listed
    //   return (article.authors || []).map((author) => {
    //       <div>
    //         <Link to={'/author/' + author.slug}>
    //           {author.name}
    //         </Link>
    //       </div>
    //   });
    // }

    return (
      <div>
        {/*
          Featured image
          TODO: change article image path before release
          <img src={article.image} alt="featured" />
        */}

        {/* Author(s) */}
        {/*renderAuthors()*/}

        {/*
          Article title with link to article
          Link format: thegazelle.org/issue/:issueId/:articleCategory/:articleSlug
        */}
        {/*}<Link to={'/issue/' + article.issueId + '/' + article.category + '/' + article.slug}>
          {this.props.title}
        </Link>
        */}

        {/* Article teaser */}
        <h2>{this.props.title}</h2>
        <p>{this.props.teaser}</p>
      </div>
    );
  }
}

// Validate shape of article JSON object
ArticlePreview.propTypes = {
  title: React.PropTypes.string.isRequired,
  teaser: React.PropTypes.string.isRequired,
}
