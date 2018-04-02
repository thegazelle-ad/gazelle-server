import { DirectTextField } from 'components/admin/form-components/DirectTextField';

// Higher Order Components
import withValidate from 'components/admin/form-components/withValidate';

export const hasHttps = value => {
  if (value && value.length > 4 && value.substr(0, 5) !== 'https') {
    return 'This url requires that you use https.';
  }
  return null;
};

export const cannotNull = value => {
  if (!value) {
    return 'This field must have an entry.';
  }
  return null;
};

export const shorterThanDbVarCar = value => {
  if (value.length > 255) {
    return 'The database restricts this field to a maximum value of 255 characters.';
  }
  return null;
};

export const HttpsUrlField = withValidate(hasHttps, shorterThanDbVarCar)(
  DirectTextField,
);

export const ShortRequiredTextField = withValidate(
  cannotNull,
  shorterThanDbVarCar,
)(DirectTextField);
