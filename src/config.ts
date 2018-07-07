/*
 * The reason we use a getter for the config is that we don't want
 * to run the validations just because you import this file, but
 * only when you use it. Running it straight away makes testing harder,
 * and in theory (though not really applicable here) can lead to
 * dangerous circular imports. Also mocking constants can be a pain
 */

export type NodeEnv = 'development' | 'staging' | 'production';

let config: {
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_ENCODING: string;
  AWS_S3_ACCESS_KEY_ID: string;
  AWS_S3_SECRET_ACCESS_KEY: string;
  SLACK_API_TOKEN: string;
  ROOT_DIRECTORY: string;
  NODE_ENV: NodeEnv;
  CI: string | undefined;
  CIRCLECI: string | undefined;
  MAIN_PORT: number;
  ADMIN_PORT: number;
};

export function getConfig() {
  if (!config) {
    config = {
      DATABASE_HOST: validateString(process.env.DATABASE_HOST, 'DATABASE_HOST'),
      DATABASE_USER: validateString(process.env.DATABASE_USER, 'DATABASE_USER'),
      DATABASE_NAME: validateString(process.env.DATABASE_NAME, 'DATABASE_NAME'),
      DATABASE_PASSWORD: validateString(
        process.env.DATABASE_PASSWORD,
        'DATABASE_PASSWORD',
      ),
      DATABASE_ENCODING: validateString(
        process.env.DATABASE_ENCODING,
        'DATABASE_ENCODING',
      ),
      AWS_S3_ACCESS_KEY_ID: validateString(
        process.env.AWS_S3_ACCESS_KEY_ID,
        'AWS_S3_ACCESS_KEY_ID',
      ),
      AWS_S3_SECRET_ACCESS_KEY: validateString(
        process.env.AWS_S3_SECRET_ACCESS_KEY,
        'AWS_S3_SECRET_ACCESS_KEY',
      ),
      SLACK_API_TOKEN: validateString(
        process.env.SLACK_API_TOKEN,
        'SLACK_API_TOKEN',
      ),
      ROOT_DIRECTORY: validateString(
        process.env.ROOT_DIRECTORY,
        'ROOT_DIRECTORY',
      ),
      NODE_ENV: validateNodeEnv(process.env.NODE_ENV, 'NODE_ENV'),
      CI: validateString(process.env.CI, 'CI', true),
      CIRCLECI: validateString(process.env.CIRCLECI, 'CIRCLECI', true),

      MAIN_PORT: validateNumber(process.env.MAIN_PORT, 'MAIN_PORT'),
      ADMIN_PORT: validateNumber(process.env.ADMIN_PORT, 'ADMIN_PORT'),
    };
  }
  return config;
}

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
