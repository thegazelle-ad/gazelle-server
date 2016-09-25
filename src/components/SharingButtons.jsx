import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class SharingButtons extends BaseComponent {

  render() {
    let renderButtons = () => {
      let nodes = [];
      let { url, title, teaser } = this.props;

      {/* Facebook Sharing Button */}
      if (this.props.facebook) {
        nodes.push (
          <a key={"facebook"} className="sharing-buttons__item__link" href={'https://facebook.com/sharer/sharer.php?u=https://www.' + url} target="_blank" aria-label="">
            <div className="sharing-buttons__item sharing-buttons__item--facebook">
              <div aria-hidden="true" className="sharing-buttons__item__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 25 25">
                  <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M18.768 7.5h-4.268v-1.905c0-.896.594-1.105 1.012-1.105h2.988v-3.942l-4.329-.013c-3.927 0-4.671 2.938-4.671 4.82v2.145h-3v4h3v12h5v-12h3.851l.417-4z" />
                </svg>
              </div>
            </div>
          </a>
        )
      }

      {/* Twitter Sharing Button */}
      if (this.props.twitter) {
        nodes.push(
          <a key={"twitter"} className="sharing-buttons__item__link" href={'https://twitter.com/intent/tweet/?text=%27' + title + '%27%20via%20%40TheGazelleAD%0A' + url + '&url=' + url} target="_blank" aria-label="">
            <div className="sharing-buttons__item sharing-buttons__item--twitter">
              <div aria-hidden="true" className="sharing-buttons__item__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M23.407 4.834c-.814.363-1.5.375-2.228.016.938-.562.981-.957 1.32-2.019-.878.521-1.851.9-2.886 1.104-.827-.882-2.009-1.435-3.315-1.435-2.51 0-4.544 2.036-4.544 4.544 0 .356.04.703.117 1.036-3.776-.189-7.125-1.998-9.366-4.748-.391.671-.615 1.452-.615 2.285 0 1.577.803 2.967 2.021 3.782-.745-.024-1.445-.228-2.057-.568l-.001.057c0 2.202 1.566 4.038 3.646 4.456-.666.181-1.368.209-2.053.079.579 1.804 2.257 3.118 4.245 3.155-1.944 1.524-4.355 2.159-6.728 1.881 2.012 1.289 4.399 2.041 6.966 2.041 8.358 0 12.928-6.924 12.928-12.929l-.012-.588c.886-.64 1.953-1.237 2.562-2.149z" />
                </svg>
              </div>
            </div>
          </a>
        )
      }

      {/* linkedIn Sharing Button */}
      if (this.props.linkedin) {
        nodes.push(
          <a key={"linkedin"} className="sharing-buttons__item__link" href={'https://www.linkedin.com/shareArticle?mini=true&amp;url=https://www.' + url + '&amp;title=' + title + '&amp;summary=' + teaser + '&amp;source=' + url} target="_blank" aria-label="">
            <div className="sharing-buttons__item sharing-buttons__item--linkedin">
              <div aria-hidden="true" className="sharing-buttons__item__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path strokeWidth="1px" strokeLinejoin="round" strokeMiterlimit="10" d="M6.5 21.5h-5v-13h5v13zm-2.51-15h-.029c-1.511 0-2.488-1.182-2.488-2.481 0-1.329 1.008-2.412 2.547-2.412 1.541 0 2.488 1.118 2.519 2.447-.001 1.3-.978 2.446-2.549 2.446zm11.51 6c-1.105 0-2 .896-2 2v7h-5s.059-12 0-13h5v1.485s1.548-1.443 3.938-1.443c2.962 0 5.062 2.144 5.062 6.304v6.654h-5v-7c0-1.104-.896-2-2-2z" />
                </svg>
              </div>
            </div>
          </a>
        )
      }

      {/* Email Sharing Button */}
      if (this.props.email) {
        nodes.push(
          <a key={"email"} className="sharing-buttons__items__item__link" href={'mailto:?subject=The%20Gazelle%20%7C%20' + title + '&body=' + url} aria-label="">
            <div className="sharing-buttons__item sharing-buttons__item--email">
              <div aria-hidden="true" className="sharing-buttons__item__icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path strokeWidth="1px" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M23.5 18c0 .828-.672 1.5-1.5 1.5h-20c-.828 0-1.5-.672-1.5-1.5v-12c0-.829.672-1.5 1.5-1.5h20c.828 0 1.5.671 1.5 1.5v12zM20.5 8.5l-8.5 5.5-8.5-5.5M3.5 16l3.5-2M20.5 16l-3.5-2" />
                </svg>
              </div>
            </div>
          </a>
        )
      }

      return nodes;
    }

    return (
      <div className="sharing-buttons">
        {renderButtons()}
      </div>
    )
  }
}

// Allows specification for which buttons are wanted
SharingButtons.propTypes = {
  facebook: React.PropTypes.bool,
  twitter: React.PropTypes.bool,
  linkedin: React.PropTypes.bool,
  email: React.PropTypes.bool,
  url: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  teaser: React.PropTypes.string,
}

// By default, all buttons are rendered
SharingButtons.defaultProps = {
  facebook: true,
  twitter: true,
  linkedin: true,
  email: true,
  url: "www.thegazelle.org",
  title: "The Gazelle | NYUAD's Independent Student News Publication",
  teaser: "The Gazelle is a weekly student publication serving the NYU Abu Dhabi community and the greater Global Network Universtiy at NYU.",
};
