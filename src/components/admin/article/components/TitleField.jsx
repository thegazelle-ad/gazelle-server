import React from 'react';
import PropTypes from 'prop-types';

import { RequiredTextField } from 'components/admin/form-components/validated-fields';

const TitleField = (props) => {
  const onChange = (event) => {
    props.onUpdate(event.target.value);
  };

  return (
    <RequiredTextField
      onChange={onChange}
      value={props.title}
      disabled={props.disabled}
      floatingLabelText="Title"
      fullWidth
    />
  );
};

TitleField.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};

export default TitleField;
