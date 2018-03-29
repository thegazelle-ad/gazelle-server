import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

const SaveButton = (props) => {
  let changedStateMessage;
  if (!props.changed) {
    if (!props.saving) {
      changedStateMessage = 'No Changes';
    } else {
      changedStateMessage = 'Saved';
    }
  } else if (!props.saving) {
    changedStateMessage = 'Save Changes';
  } else {
    changedStateMessage = 'Saving';
  }

  return (
    <RaisedButton
      label={changedStateMessage}
      primary
      style={props.style}
      onClick={props.onClick}
      disabled={!props.changed || props.saving}
    />
  );
};

SaveButton.propTypes = {
  style: PropTypes.object,
  changed: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default SaveButton;
