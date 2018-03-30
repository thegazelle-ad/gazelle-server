/* eslint-disable react/jsx-filename-extension */
/* This is what allows babel to transpile async functions */
import 'regenerator-runtime/runtime';

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
import routes from 'routes/admin-routes';
import {
  injectModelCreateElement,
  setAppReady,
} from 'lib/falcor/falcor-utilities';
import HttpDataSource from 'falcor-http-datasource';
import { Provider as FalcorProvider } from 'react-falcor';

// Set app ready so falcor doesn't try to load from cache
setAppReady();

const clientModel = new falcor.Model({
  source: new HttpDataSource('/model.json'),
});

ReactDOM.render(
  <FalcorProvider falcor={clientModel}>
    <Router
      history={browserHistory}
      routes={routes}
      createElement={injectModelCreateElement(clientModel)}
    />
  </FalcorProvider>,
  document.getElementById('main'),
);
