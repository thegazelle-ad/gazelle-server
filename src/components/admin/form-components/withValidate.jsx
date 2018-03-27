import React from 'react';

import { getDisplayName } from 'lib/higher-order-helpers';

/**
* This component wraps fields and handles the validation of the value inside of them
* @param {func} validators - array of validation functions of the form which take the
* of the field as an argument and return the errorText associated with the validator
* if the value is invalid and returns null if the value is valid
* @param {component} WrappedField - a component which stores the value to be validated
* in the value prop and takes an errorText prop to display invalidity
 */

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
      ReturnedComponent = <WrappedField {...originalProps} />;
    }
    return ReturnedComponent;
  };
  ValidatedField.displayName = `ValidatedField(${getDisplayName(WrappedField)})`;
  return ValidatedField;
};

export default withValidate;
