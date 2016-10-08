import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import { Link, browserHistory } from 'react-router';

export default class Header extends BaseComponent {
  // Allows user to navigate to populated search page on pressing 'Enter'
  handleSubmit (e) {
    e.preventDefault();
    browserHistory.push('/search?q=' + e.target["search-box"].value);
  }

  // onKeyPress={this.handleKeyPress}
  render() {
    return (
      <div>
        <div className="header">
          <div className="header__search">
            <form onSubmit={this.handleSubmit}>
              <input
                name="search-box"
                className="header__search__main"
                type="text"
                placeholder="Search The Gazelle"
              />
              <div className="header__search__tail"></div>
              <input
                type="submit"
                className="header__search__text"
                value="SEARCH"
              />
            </form>
          </div>
          <div className="header__title">
            {/* TODO: change link to proper Gazelle icon uploaded to server*/}
            <Link to="/" className="header__title__content">
              <img src="https://thegazelle.s3.amazonaws.com/gazelle/2016/02/header-logo.png" alt="logo" />
              <h1 className="header__title__content__site-name">{this.props.appName}</h1>
            </Link>
          </div>
          <div className="header__social">
            <a href="https://www.facebook.com/TheGazelleAD" className="header__social--facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 25">
                <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M18.768 7.5h-4.268v-1.905c0-.896.594-1.105 1.012-1.105h2.988v-3.942l-4.329-.013c-3.927 0-4.671 2.938-4.671 4.82v2.145h-3v4h3v12h5v-12h3.851l.417-4z" />
              </svg>
            </a>
            <a href="https://twitter.com/TheGazelleAD" className="header__social--twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M23.407 4.834c-.814.363-1.5.375-2.228.016.938-.562.981-.957 1.32-2.019-.878.521-1.851.9-2.886 1.104-.827-.882-2.009-1.435-3.315-1.435-2.51 0-4.544 2.036-4.544 4.544 0 .356.04.703.117 1.036-3.776-.189-7.125-1.998-9.366-4.748-.391.671-.615 1.452-.615 2.285 0 1.577.803 2.967 2.021 3.782-.745-.024-1.445-.228-2.057-.568l-.001.057c0 2.202 1.566 4.038 3.646 4.456-.666.181-1.368.209-2.053.079.579 1.804 2.257 3.118 4.245 3.155-1.944 1.524-4.355 2.159-6.728 1.881 2.012 1.289 4.399 2.041 6.966 2.041 8.358 0 12.928-6.924 12.928-12.929l-.012-.588c.886-.64 1.953-1.237 2.562-2.149z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/thegazelle_ad/" className="header__social--instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24">
                <path className="header__social--instagram--bg" strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M11.93,2.24c3.15,0,3.53,0,4.77.07a6.54,6.54,0,0,1,2.19.41,3.66,3.66,0,0,1,1.36.88A3.66,3.66,0,0,1,21.14,5a6.54,6.54,0,0,1,.41,2.19c.06,1.25.07,1.62.07,4.77s0,3.53-.07,4.77a6.54,6.54,0,0,1-.41,2.19,3.91,3.91,0,0,1-2.24,2.24,6.54,6.54,0,0,1-2.19.41c-1.25.06-1.62.07-4.77.07s-3.53,0-4.77-.07A6.54,6.54,0,0,1,5,21.14a3.66,3.66,0,0,1-1.36-.88,3.66,3.66,0,0,1-.88-1.36,6.54,6.54,0,0,1-.41-2.19c-.06-1.25-.07-1.62-.07-4.77s0-3.53.07-4.77A6.54,6.54,0,0,1,2.72,5,3.66,3.66,0,0,1,3.6,3.6,3.66,3.66,0,0,1,5,2.72a6.54,6.54,0,0,1,2.19-.41c1.25-.06,1.62-.07,4.77-.07" /><path strokeWidth="0.01px" strokeLinejoin="round" strokeMiterlimit="10" d="M11.94,2.39c3.13,0,3.5,0,4.74.07a6.49,6.49,0,0,1,2.18.4,3.63,3.63,0,0,1,1.35.88,3.63,3.63,0,0,1,.88,1.35,6.49,6.49,0,0,1,.4,2.18c.06,1.24.07,1.61.07,4.74s0,3.5-.07,4.74a6.49,6.49,0,0,1-.4,2.18,3.88,3.88,0,0,1-2.23,2.23,6.49,6.49,0,0,1-2.18.4c-1.24.06-1.61.07-4.74.07s-3.5,0-4.74-.07A6.49,6.49,0,0,1,5,21.15a3.63,3.63,0,0,1-1.35-.88,3.63,3.63,0,0,1-.88-1.35,6.49,6.49,0,0,1-.4-2.18c-.06-1.24-.07-1.61-.07-4.74s0-3.5.07-4.74a6.49,6.49,0,0,1,.4-2.18,3.63,3.63,0,0,1,.88-1.35A3.63,3.63,0,0,1,5,2.86a6.49,6.49,0,0,1,2.18-.4c1.24-.06,1.61-.07,4.74-.07m0-2.11C8.75.27,8.35.29,7.1.34A8.61,8.61,0,0,0,4.25.89,5.75,5.75,0,0,0,2.18,2.24,5.75,5.75,0,0,0,.82,4.32,8.61,8.61,0,0,0,.28,7.17C.22,8.42.21,8.82.21,12s0,3.59.07,4.84a8.61,8.61,0,0,0,.55,2.85,5.75,5.75,0,0,0,1.35,2.08,5.75,5.75,0,0,0,2.08,1.35,8.61,8.61,0,0,0,2.85.55c1.25.06,1.65.07,4.84.07s3.59,0,4.84-.07a8.61,8.61,0,0,0,2.85-.55,6,6,0,0,0,3.43-3.43,8.61,8.61,0,0,0,.55-2.85c.06-1.25.07-1.65.07-4.84s0-3.59-.07-4.84a8.61,8.61,0,0,0-.55-2.85A5.75,5.75,0,0,0,21.7,2.24,5.75,5.75,0,0,0,19.62.89,8.61,8.61,0,0,0,16.77.34C15.52.29,15.12.27,11.94.27h0Z" /><path strokeWidth="0.01px" strokeLinejoin="round" strokeMiterlimit="10" d="M11.94,6a6,6,0,1,0,6,6h0A6,6,0,0,0,11.94,6Zm0,9.93A3.91,3.91,0,1,1,15.85,12,3.91,3.91,0,0,1,11.94,15.91Z" /><circle strokeWidth="0.01px" strokeLinejoin="round" strokeMiterlimit="10" cx="18.2" cy="5.74" r="1.41" />
              </svg>
            </a>
          </div>
        </div>
      </div>
		);
  }
}

Header.propTypes = {
  appName: React.PropTypes.string,
}
