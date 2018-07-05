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
import routes from 'routes/admin-routes';
import { injectModelCreateElement } from 'lib/falcor/falcor-utilities';
import { ModalProvider } from 'components/admin/hocs/modals/ModalProvider';
import HttpDataSource from 'falcor-http-datasource';
import { MuiThemeProvider } from 'material-ui';
import { Provider as FalcorProvider } from 'react-falcor';

/** We need to initialize the logger */
import { initializeLogger } from 'lib/logger';

// We start with window.alert as our alert function but later will replace
// it with our alert function from ModalProvider
initializeLogger(true, window.alert);

const clientModel = new falcor.Model({
  source: new HttpDataSource('/model.json'),
});

ReactDOM.render(
  <MuiThemeProvider>
    <FalcorProvider falcor={clientModel}>
      <ModalProvider>
        <Router
          history={browserHistory}
          routes={routes}
          createElement={injectModelCreateElement(clientModel)}
        />
      </ModalProvider>
    </FalcorProvider>
  </MuiThemeProvider>,
  document.getElementById('main'),
);
