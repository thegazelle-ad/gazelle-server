import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import falcor from 'falcor';
import routes from 'lib/editor-routes';
import { injectModelCreateElement, setAppReady } from 'lib/falcor/falcor-utilities';
import HttpDataSource from 'falcor-http-datasource';

// Set app ready so falcor doesn't try to load from cache
setAppReady();

const clientModel = new falcor.Model({
  source: new HttpDataSource('/model.json'),
});

function hashLinkScroll(retryCount = 0, retryLimit = 200) {
  // scroll to the hash location once page loads,
  // if element is not rendered yet, try again in 100ms
  const { hash } = window.location;
  if (hash) {
    window.requestAnimationFrame(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView();
      } else if (retryCount < retryLimit) {
        setTimeout(hashLinkScroll(retryCount + 1), 100);
      }
    }, 0);
  }
}

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
    createElement={injectModelCreateElement(clientModel)}
    onUpdate={hashLinkScroll}
  />,
document.getElementById('main'));
