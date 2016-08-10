import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class AlertBar extends BaseComponent {
  render() {
    return (
      <div>
        <div className="dim" />
        <a onClick={() => {window.location.reload()}}>
          <div className="alert-bar">
            <p className="alert-bar__message">{this.props.message}</p>
          </div>
        </a>
      </div>
    );
  }
}

AlertBar.propTypes = {
  message: React.PropTypes.string.isRequired,
}
