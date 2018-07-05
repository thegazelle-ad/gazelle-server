/* eslint-disable react/jsx-filename-extension */
// Emil hacking because he can't find a babel plugin that does it for some reason
if (!Array.prototype.flatten) {
  // eslint-disable-next-line
  Array.prototype.flatten = function flatten() {
    return this.reduce((acc, cur) => acc.concat(cur), []);
  };
}

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import falcor from 'falcor';
import routes from 'routes/main-routes';
import { injectModelCreateElement } from 'lib/falcor/falcor-utilities';
import HttpDataSource from 'falcor-http-datasource';
import { setIsClient } from 'lib/utilities';
import ReactGA from 'react-ga';
import { Provider as FalcorProvider } from 'react-falcor';

/** For initializing the logger */
import { initializeLogger } from 'lib/logger';

initializeLogger(true, window.alert);

// Let the app know we are running as client, activates certain behaviors like
// global client tracking.
setIsClient(true);

const clientModel = new falcor.Model({
  source: new HttpDataSource('/model.json'),
});

// _initialCache is a global exposed by the first server side render
clientModel.setCache(_initialCache); // eslint-disable-line no-undef

// Initialize Google Analytics tracking
ReactGA.initialize('UA-84302849-1');

// Establish pageview tracking
const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

ReactDOM.render(
  <FalcorProvider falcor={clientModel}>
    <Router
      history={browserHistory}
      routes={routes}
      onUpdate={logPageView}
      createElement={injectModelCreateElement(clientModel)}
    />
  </FalcorProvider>,
  document.getElementById('main'),
);
