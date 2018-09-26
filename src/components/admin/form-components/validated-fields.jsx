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

export const shorterThanDbVarChar = value => {
  if (value.length > 255) {
    return 'The database restricts this field to a maximum value of 255 characters.';
  }
  return null;
};

export const isPrettySlug = value => {
  const prettySlug = /^[a-z0-9-]+$/g;
  if (value && !prettySlug.test(value)) {
    return 'This slug could cause errors in the URL, please use the format "your-slug-here".';
  }
  return null;
};

export const HttpsUrlField = withValidate(hasHttps, shorterThanDbVarChar)(
  DirectTextField,
);

export const ShortRequiredTextField = withValidate(
  cannotNull,
  shorterThanDbVarChar,
)(DirectTextField);

export const SlugField = withValidate(isPrettySlug)(ShortRequiredTextField);
