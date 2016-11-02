import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import falcor from 'falcor';
import routes from 'lib/editor-routes';
import { injectModelCreateElement, setAppReady } from 'lib/falcor/falcorUtils';
import HttpDataSource from 'falcor-http-datasource';

// Set app ready so falcor doesn't try to load from cache
setAppReady();

let clientModel = new falcor.Model({
  source: new HttpDataSource('/model.json'),
});

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
    createElement={injectModelCreateElement(clientModel)}
  />,
document.getElementById('main'));
