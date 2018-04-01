import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, RaisedButton } from 'material-ui';

export const Confirm = ({ open, contentStyle, message, onConfirm, onDeny }) => {
  const actionButtons = [
    <RaisedButton onClick={onConfirm} label="OK" />,
    <RaisedButton onClick={onDeny} label="CANCEL" />,
  ];
  return (
    <Dialog
      open={open}
      modal
      actions={actionButtons}
      contentStyle={contentStyle}
    >
      {message}
    </Dialog>
  );
};

Confirm.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  contentStyle: PropTypes.shape({}),
};

Confirm.defaultProps = {
  contentStyle: {},
};
