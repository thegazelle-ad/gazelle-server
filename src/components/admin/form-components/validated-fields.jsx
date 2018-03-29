import TextField from 'material-ui/TextField';

// Higher Order Components
import withValidate from 'components/admin/form-components/withValidate';

export const hasHttps = value => {
  if (value && value.length > 4 && value.substr(0, 5) !== 'https') {
    return 'This url requires that you use https.';
  }
  return null;
};

export const ValidatedHttpsUrlField = withValidate(hasHttps)(TextField);
