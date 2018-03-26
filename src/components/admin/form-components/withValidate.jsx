import React from 'react';

import { getDisplayName } from 'lib/higher-order-helpers';

const withValidate = (...validators) => (WrappedField) => {
  const ValidatedField = (originalProps) => {
    const failedValidator = validators
      .find(validator =>
        validator(originalProps.value)
      );
    let ReturnedComponent;
    if (failedValidator) {
      ReturnedComponent =
        (<WrappedField
          errorText={failedValidator(originalProps.value)}
          {...originalProps}
        />);
    } else {
      ReturnedComponent = (<WrappedField {...originalProps} />);
    }
    return ReturnedComponent;
  };
  ValidatedField.displayName = `ValidatedField(${getDisplayName(WrappedField)})`;
  return ValidatedField;
};

export default withValidate;
