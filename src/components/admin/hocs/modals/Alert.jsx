import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, RaisedButton, SvgIcon } from 'material-ui';

/**
 * Taken from https://commons.wikimedia.org/wiki/File:OOjs_UI_icon_alert-warning.svg
 * @param {Object} props - the props for the React component
 * @returns {Object} the JSX as a React component should
 */
const AlertIcon = props => (
  <SvgIcon
    style={
      props.style || { fill: '#ff5d00', width: props.size, height: props.size }
    }
  >
    <path d="M11 16h2v2h-2z" />
    <path d="M13.516 10h-3L11 15h2z" />
    <path d="M12.017 5.974L19.537 19H4.497l7.52-13.026m0-2.474c-.545 0-1.09.357-1.5 1.07L2.53 18.403C1.705 19.833 2.38 21 4.03 21H20c1.65 0 2.325-1.17 1.5-2.6L13.517 4.575c-.413-.715-.956-1.072-1.5-1.072z" />
  </SvgIcon>
);

AlertIcon.propTypes = {
  size: PropTypes.string,
  style: PropTypes.shape({}),
};

AlertIcon.defaultProps = {
  size: '24px',
  style: null,
};

export const Alert = ({ open, message, onClose }) => {
  const actionButtons = [
    <RaisedButton id="alert-modal-ok-button" onClick={onClose} label="OK" />,
  ];
  return (
    <Dialog
      open={open}
      modal
      actions={actionButtons}
      contentStyle={{ maxWidth: '500px' }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AlertIcon size="150px" />
        </div>
        <div id="alert-modal-text" style={{ textAlign: 'center' }}>
          {message}
        </div>
      </div>
    </Dialog>
  );
};

Alert.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
