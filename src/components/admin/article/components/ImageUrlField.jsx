import React from 'react';
import PropTypes from 'prop-types';

import { ValidatedHttpsUrlField } from 'components/admin/form-components/validated-fields';

const ImageUrlField = (props) => {
  const onChange = (event) => {
    props.updateImage(event.target.value);
  };

  return (
    <ValidatedHttpsUrlField
      name="imageUrl"
      value={props.imageUrl}
      floatingLabelText="Image (Remember to use https:// not http://)"
      disabled={props.disabled}
      onChange={onChange}
      fullWidth
    />
  );
};

ImageUrlField.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  updateImage: PropTypes.func.isRequired,
};

export default ImageUrlField;
