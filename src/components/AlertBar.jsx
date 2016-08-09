import React from 'react';
import BaseComponent from 'lib/BaseComponent';

export default class AlertBar extends BaseComponent {
  render() {
    return (
      <div className="alert-bar">
        <p className="alert-bar__message">{this.props.message}</p>
      </div>
    );
  }
}

AlertBar.propTypes = {
  message: React.PropTypes.string.isRequired,
}
