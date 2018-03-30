import TextField from 'material-ui/TextField';

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

export const hasVarCharMax = value => {
  if (value.length > 150) {
    return 'The database restricts this field to a maximum value of 150 characters.';
  }
  return null;
};

export const ValidatedHttpsUrlField = withValidate(hasHttps)(TextField);

export const RequiredTextField = withValidate(cannotNull, hasVarCharMax)(
  TextField,
);
