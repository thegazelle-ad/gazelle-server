import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import _ from 'lodash';
import { Link } from 'react-router';

export default class Navigation extends BaseComponent {
  render() {
    // Render all categories in nav bar
    let categories = [
      {
        name: "off campus",
        slug: "off-campus",
      },
      {
        name: "on campus",
        slug: "on-campus",
      },
      {
        name: "commentary",
        slug: "commentary",
      },
      {
        name: "creative",
        slug: "creative",
      },
      {
        name: "in focus",
        slug: "in-focus",
      },
    ];
    let renderCategories =
      _.map((categories || []), function(category) {
        return(
          <li key={category.slug} className="navigation__categories__item">
            <Link to={"/category/"+category.slug}>
              {category.name}
            </Link>
          </li>
        )
      });

    return (
      <div>
        <div className="header">
          <div className="header__search">
            <input
              className="header__search__main"
              type="text"
              placeholder="Search The Gazelle"
            />
            <div className="header__search__tail"></div>
            <div className="header__search__text">SEARCH</div>
          </div>
          <div className="header__title">
            {/* TODO: change link to proper Gazelle icon uploaded to server*/}
            <Link to="/" className="header__title__content">
              <img src="http://www.thegazelle.org/wp-content/themes/gazelle/images/gazelle_logo.png" alt="logo" />
              <h1 className="header__title__content__site-name">{this.props.appName}</h1>
            </Link>
          </div>
          {/* TODO: change link to archives list */}
          <Link to="/" className="header__issueId">{"Issue 55"}</Link>
        </div>

        <div className="navigation">
          <p className="navigation__publication-date">Aug. 15, 2016</p>
          <ul className="navigation__categories">
            {renderCategories}
          </ul>
          <div className="navigation__social">
            <a href="https://www.facebook.com/TheGazelleAD" className="navigation__social--facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 25">
                <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M18.768 7.5h-4.268v-1.905c0-.896.594-1.105 1.012-1.105h2.988v-3.942l-4.329-.013c-3.927 0-4.671 2.938-4.671 4.82v2.145h-3v4h3v12h5v-12h3.851l.417-4z" />
              </svg>
            </a>
            <a href="https://twitter.com/TheGazelleAD" className="navigation__social--twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M23.407 4.834c-.814.363-1.5.375-2.228.016.938-.562.981-.957 1.32-2.019-.878.521-1.851.9-2.886 1.104-.827-.882-2.009-1.435-3.315-1.435-2.51 0-4.544 2.036-4.544 4.544 0 .356.04.703.117 1.036-3.776-.189-7.125-1.998-9.366-4.748-.391.671-.615 1.452-.615 2.285 0 1.577.803 2.967 2.021 3.782-.745-.024-1.445-.228-2.057-.568l-.001.057c0 2.202 1.566 4.038 3.646 4.456-.666.181-1.368.209-2.053.079.579 1.804 2.257 3.118 4.245 3.155-1.944 1.524-4.355 2.159-6.728 1.881 2.012 1.289 4.399 2.041 6.966 2.041 8.358 0 12.928-6.924 12.928-12.929l-.012-.588c.886-.64 1.953-1.237 2.562-2.149z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
		);
	}
}

Navigation.propTypes = {
  appName: React.PropTypes.string,
}
