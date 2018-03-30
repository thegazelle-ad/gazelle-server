import React from 'react';
import classnames from 'classnames';
import BaseComponent from 'lib/BaseComponent';
import { registerLoaderCallback, isLoading } from 'lib/loader';

export default class Loader extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      active: false, // If we are starting a load or finishing a load
    };
  }

  loadingChange(loading) {
    this.safeSetState({
      loading,
      active: true,
    });
    // Coming down off a load, we need to unset active at end of animation
    if (!loading) {
      setTimeout(() => {
        // Check we haven't entered a new loading
        if (!this.state.loading) {
          this.safeSetState({
            active: false,
          });
        }
      }, 300);
    }
  }

  componentWillMount() {
    registerLoaderCallback(this.loadingChange.bind(this));
    this.safeSetState({
      loading: isLoading(),
      active: isLoading(),
    });
  }

  render() {
    const { loading, active } = this.state;
    const containerClass = classnames('loader', {
      'loader--hide': !active,
    });
    const loaderClass = classnames('loader--percent', {
      'loader--percent--loading': loading,
      'loader--percent--finishing': !loading && active,
    });

    return (
      <div className={containerClass}>
        <div className={loaderClass} />
      </div>
    );
  }
}
