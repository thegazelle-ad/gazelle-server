import React from 'react';
import BaseComponent from 'lib/BaseComponent';
import classnames from 'classnames';

export default class Alert extends BaseComponent {
  render() {
    let alertClass = classnames({
      'alert-bar': this.props.bar,
      'alert-box': this.props.box,
    });
    return (
      <div>
        <a onClick={() => {window.location.reload()}}>
          <div className={alertClass}>
            <div className={alertClass + "__item"}>
              <p className="alert__message">{this.props.message}</p>
            </div>
          </div>
        </a>
        <div className="dim" />
      </div>
    );
  }
}

Alert.propTypes = {
  message: React.PropTypes.string.isRequired,
  // Allows for specification of type of alert display -- top bar or centered window
  bar: React.PropTypes.bool,
  box: React.PropTypes.bool,
}

Alert.defaultProps = {
  message: "Oops! Somthing has gone wrong. Please click to refresh.",
  bar: false,
  box: false,
}
