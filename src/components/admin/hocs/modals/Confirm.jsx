import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton } from 'material-ui';

export const Confirm = ({ open, message, onConfirm, onDeny, style }) => {
  const actionButtons = [
    <FlatButton primary onClick={onConfirm} label="OK" />,
    <FlatButton primary onClick={onDeny} label="CANCEL" />,
  ];
  return (
    <Dialog open={open} modal actions={actionButtons} style={style}>
      {message}
    </Dialog>
  );
};

Confirm.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
};

Confirm.defaultProps = {
  style: {},
};
