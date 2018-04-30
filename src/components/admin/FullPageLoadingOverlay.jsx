import React from 'react';

import LoadingOverlay from 'components/admin/LoadingOverlay';

export const FullPageLoadingOverlay = () => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000000,
    }}
  >
    <LoadingOverlay />
  </div>
);
