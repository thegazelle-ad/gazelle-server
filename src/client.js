import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import falcor from 'falcor';
import routes from 'lib/routes';
import { injectModelCreateElement } from 'lib/falcor/falcorUtils';
import HttpDataSource from 'falcor-http-datasource';
import { setIsClient } from 'lib/utilities';

// Let the app know we are running as client, activates certain behaviors like
// global client tracking.
setIsClient(true);

let clientModel = new falcor.Model({
  source: new HttpDataSource('/model.json'),
});

// _initialCache is a global exposed by the first server side render
clientModel.setCache(_initialCache); // eslint-disable-line no-undef

ReactDOM.render(
  <Router
    history={browserHistory}
    routes={routes}
    createElement={injectModelCreateElement(clientModel)}
  />,
document.getElementById('main'));
