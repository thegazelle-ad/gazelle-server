export const DATABASE_HOST = validateString(
  process.env.DATABASE_HOST,
  'DATABASE_HOST',
);
export const DATABASE_USER = validateString(
  process.env.DATABASE_USER,
  'DATABASE_USER',
);
export const DATABASE_NAME = validateString(
  process.env.DATABASE_NAME,
  'DATABASE_NAME',
);
export const DATABASE_PASSWORD = validateString(
  process.env.DATABASE_PASSWORD,
  'DATABASE_PASSWORD',
);
export const AWS_S3_ACCESS_KEY_ID = validateString(
  process.env.AWS_S3_ACCESS_KEY_ID,
  'AWS_S3_ACCESS_KEY_ID',
);
export const AWS_S3_SECRET_ACCESS_KEY = validateString(
  process.env.AWS_S3_SECRET_ACCESS_KEY,
  'AWS_S3_SECRET_ACCESS_KEY',
);
export const SLACK_API_TOKEN = validateString(
  process.env.SLACK_API_TOKEN,
  'SLACK_API_TOKEN',
);
export const ROOT_DIRECTORY = validateString(
  process.env.ROOT_DIRECTORY,
  'ROOT_DIRECTORY',
);
export const NODE_ENV = validateNodeEnv(process.env.NODE_ENV, 'NODE_ENV');
export const CI = validateString(process.env.CI, 'CI', true);
export const CIRCLECI = validateString(process.env.CIRCLECI, 'CIRCLECI', true);

export const MAIN_PORT = validateNumber(process.env.MAIN_PORT, 'MAIN_PORT');
export const ADMIN_PORT = validateNumber(process.env.ADMIN_PORT, 'ADMIN_PORT');

// This is the syntax for function overloads in Typescript
function validateString(
  variable: typeof process.env[string],
  name: string,
  allowUndefined?: false,
): string;
function validateString(
  variable: typeof process.env[string],
  name: string,
  allowUndefined: true,
): string | undefined;
function validateString(
  variable: typeof process.env[string],
  name: string,
  allowUndefined = false,
): any {
  if (allowUndefined && variable === undefined) {
    return undefined;
  }
  if (variable === undefined) {
    throw new Error(`environment variable ${name} is not defined`);
  }
  if (typeof variable !== 'string') {
    throw new Error(
      `environment variable ${name} with value ${variable} is not a string`,
    );
  }
  return variable;
}

function validateNumber(
  variable: typeof process.env[string],
  name: string,
): number {
  return parseInt(validateString(variable, name), 10);
}

export type NodeEnv = 'development' | 'staging' | 'production';

function validateNodeEnv(
  variable: typeof process.env[string],
  name: 'NODE_ENV',
): NodeEnv {
  const nodeEnvString = validateString(variable, name);
  if (
    !(
      nodeEnvString === 'development' ||
      nodeEnvString === 'staging' ||
      nodeEnvString === 'production'
    )
  ) {
    throw new Error(`Invalid NODE_ENV value: ${variable}`);
  }
  return nodeEnvString;
}
