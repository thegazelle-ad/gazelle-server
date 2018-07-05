import React from 'react';
import BaseComponent from 'lib/BaseComponent';
// material UI
import CircularProgress from 'material-ui/CircularProgress';

export default class LoadingOverlay extends BaseComponent {
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          opacity: 0.5,
          zIndex: 100000,
          backgroundColor: 'black',
        }}
      >
        <div
          className="circular-progress"
          style={{
            margin: 0,
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CircularProgress />
        </div>
      </div>
    );
  }
}
