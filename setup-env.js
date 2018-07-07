/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-multi-str */
// This isn't the actual code so it's correct to have it in devDependencies
/* eslint-disable import/no-extraneous-dependencies */
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const _ = require('lodash');

// Get the sample env file
let sampleEnv;
try {
  sampleEnv = fs.readFileSync('.sample-env', { encoding: 'utf8' });
} catch (e) {
  console.error('\n\n');
  console.error(
    'ERROR: There was an error opening the .sample-env file, are you sure you \
are running this command through npm run setup or from the root directory?',
  );
  console.error('\n\n');
  throw e;
}
const trimmedSampleEnvLines = sampleEnv.split('\n').map(x => x.trim());

// Attempt to get the current .env file if it exists
let envFile;
try {
  envFile = fs.readFileSync('.env', { encoding: 'utf8' });
} catch (e) {
  // ENOENT means the file didn't exist, in which case we just assume that
  // the user currently has no .env file which is fine
  if (e.code !== 'ENOENT') {
    console.error('\n\n');
    console.error(
      'ERROR: There was an error opening the .env file, even though it seems to exist',
    );
    console.error('\n\n');
    throw e;
  }
}
const trimmedEnvFileLines = envFile
  ? envFile.split('\n').map(x => x.trim())
  : envFile;

// The different states our parser can be in
const NEUTRAL = 0;
const MAIN_DESCRIPTION = 1;
const SECTION_HEADER = 2;
const COMMENT = 3;
// We use this state if the user doesn't want to do deployment config
const WRITE_REST = 4;

// A global state of whether we should get defaults from the sample or real env
let shouldUseCurrentEnv = false;

// Tests for each type
const isSectionComment = line => /^#.*#$/.test(line);
const extractSectionCommentText = line =>
  /^#+([\w\s.,'!:`#()-]*?)#+$/.exec(line)[1].trim();
const isAssignment = line => line.includes('=');
const parseAssignment = line => /^(\w+?)=(.*)/.exec(line).slice(1, 3);
const isTitle = line => /^#[^#]/.test(line);
const extractTitle = line => /^#(.+)/.exec(line)[1].trim();
const isComment = line => /^##[^#]/.test(line);
const extractComment = line => /^##(.+)/.exec(line)[1].trim();

// Helper
function throwError(err) {
  console.error(err);
  process.exit(1);
}

// The styles for our messages
const welcomeGoodbyeStyle = chalk.underline;
const boldCyan = chalk.bold.cyanBright;
const titleStyle = chalk.whiteBright.bold;

const WELCOME_MESSAGE = `\n\
Hi! Welcome to the setup script for The Gazelle's Engineering Team! \
The source code for this script is located in the root directory of this \
project with file name ${boldCyan('setup-env.js')}, and it uses ${boldCyan(
  '.sample-env',
)}, also in the root directory, as the source for all the section headers, \
comments, and environment variables to setup. At the end of this guide the \
script will output a ${boldCyan('.env')} file to the root directory which \
our code needs in order to for example connect to the database. If you ever \
need to edit this file you can either run this script again \
(${boldCyan('node setup-env.js')}) or edit ${boldCyan('.env')} directly.

When filling out the variables, the default value if you don't input anything \
will be shown in parenthesis at the end of the prompt. If a default is \
provided it's often because it's the value you'll be using in most cases \
and unless there's something different about your setup you shouldn't \
need to change these.

If you find that there's anything that could be better about this guide, \
please do improve ${boldCyan('setup-env.js')} or ${boldCyan('.sample-env')} \
and submit a pull request so the next generation of developers can have \
an easier time!\
`;

const GOODBYE_MESSAGE = `\
You should now have your environment totally setup! Try out running \
npm run build && npm start and see if you have The Gazelle running \
successfully by checking out localhost:3000 and localhost:4000 (or \
whichever ports you set in the config) in your browser!`;

// We support a command here to check whether .env is outdated (is missing some variables from .sample-env)
// it makes more sense to put this command in this script than write a separate one as we reuse code and
// don't have to keep track of as many files
if (process.argv.length === 3 && process.argv[2] === '--check-outdated') {
  const exitCode = sampleAndCurrentHaveSameVariables() ? 0 : 1;
  // We notify the caller of the result through our exit code
  process.exit(exitCode);
}

// I want to use async/await, but only works in an async function
main();

async function main() {
  // Say hi
  console.log(welcomeGoodbyeStyle(`${WELCOME_MESSAGE}\n`));

  // Give them some space to read the message
  await shouldContinue();
  // newline
  console.log();

  // Before we start the actual loop we check whether there already exists a .env file
  if (trimmedEnvFileLines) {
    console.log(
      welcomeGoodbyeStyle('We discovered that you already have a .env \
file\n'),
    );

    const answer = await inquirer.prompt({
      type: 'confirm',
      name: 'shouldUseCurrentEnv',
      default: true,
      message:
        'Would you like us to use the currently set values as the defaults when possible?',
    });
    ({ shouldUseCurrentEnv } = answer);
  }

  let state = NEUTRAL;
  let mainDescriptionSeen = false;
  let currentText = '';
  // The file descriptor for the env file
  const fd = fs.openSync('.env', 'w');
  for (let i = 0; i < trimmedSampleEnvLines.length; i++) {
    const line = trimmedSampleEnvLines[i];
    let lineToWrite = line;
    if (state === MAIN_DESCRIPTION || state === SECTION_HEADER) {
      if (isSectionComment(line)) {
        const text = extractSectionCommentText(line);
        if (
          text === 'DEPLOYMENT' &&
          !(await checkIfShouldDoDeploymentConfig())
        ) {
          state = WRITE_REST;
        } else {
          currentText += '\n';
          currentText += line;
          if (!text) {
            if (state === SECTION_HEADER) {
              console.log(boldCyan(`${currentText}\n`));
            }
            state = NEUTRAL;
          }
        }
      } else {
        throwError('Found a non closed section comment');
      }
    } else if (state === COMMENT) {
      if (isComment(line)) {
        currentText = `${currentText} ${extractComment(line)}`;
      } else {
        // Comment is done, so we print it and change the state to neutral + reset the loop
        // so the current line can be properly parsed
        console.log(boldCyan(currentText));
        state = NEUTRAL;
        i -= 1;
        continue;
      }
    } else if (state === NEUTRAL) {
      // Note that the order and the else if's are important here as otherwise
      // our regexes would have to be more specific
      if (isSectionComment(line)) {
        currentText = line;
        // We assume that the first section is the main description
        // which we don't want to print as it's only for reading directly
        if (!mainDescriptionSeen) {
          mainDescriptionSeen = true;
          state = MAIN_DESCRIPTION;
        } else {
          state = SECTION_HEADER;
        }
      } else if (isTitle(line)) {
        // We assume titles are never more than one line
        const title = extractTitle(line);
        console.log(titleStyle(title));
        console.log(titleStyle('-'.repeat(title.length)));
        // newline
        console.log();
      } else if (isComment(line)) {
        state = COMMENT;
        currentText = `NOTE: ${extractComment(line)}`;
      } else if (isAssignment(line)) {
        const [variable] = parseAssignment(line);
        const defaultValue = getDefaultValue(variable);
        let assignedValue;
        const question = `What value would you like to set ${variable} to?`;
        // If it's GAZELLE_ENV we want to restrict answers to 'staging' or 'production'
        if (variable === 'GAZELLE_ENV') {
          const answer = await inquirer.prompt({
            type: 'list',
            name: variable,
            message: question,
            choices: ['staging', 'production'],
          });
          assignedValue = answer[variable];
        } else {
          const isPassword = variable.toLowerCase().includes('password');
          const answer = await inquirer.prompt({
            type: isPassword ? 'password' : 'input',
            mask: isPassword ? '*' : undefined,
            name: variable,
            default: defaultValue,
            message: question,
          });
          assignedValue = answer[variable];
        }
        // We aren't handling all the escaping values or setting quotes or not
        // but in most if not all cases this should work. If in the future problems
        // are encountered with this then it would have to be handled with some logic though
        lineToWrite = `${variable}=${assignedValue}`;
        // newline
        console.log();
      } else {
        state = NEUTRAL;
      }
    } else if (state === WRITE_REST) {
      // Don't do anything, the user chose not to continue, we'll set defaults for the rest
      // and not print anything
    } else {
      throwError('Parser is in an unknown state');
    }
    fs.writeSync(fd, Buffer.from(`${lineToWrite}\n`, 'utf-8'));
  }
  fs.closeSync(fd);
  console.log(welcomeGoodbyeStyle(`${GOODBYE_MESSAGE}\n`));
  // Give them some space to read goodbye message
  await shouldContinue('Press enter to exit', 'input');
}

async function checkIfShouldDoDeploymentConfig() {
  const answer = await inquirer.prompt({
    type: 'confirm',
    name: 'shouldContinue',
    default: false,
    message:
      "You are done with all the necessary config for development now, would you also like to set up deployment related config? This is meant only for setting up the actual server and if you're in doubt, the answer is probably no",
  });
  // newline
  console.log();
  return answer.shouldContinue;
}

async function shouldContinue(message, type) {
  const answer = await inquirer.prompt({
    type: type || 'confirm',
    name: 'shouldContinue',
    message: message || 'Continue?',
  });
  if (!answer.shouldContinue) {
    process.exit(0);
  }
}

function sampleAndCurrentHaveSameVariables() {
  // We use sets as for the deep equality we don't care about order of variables
  const sampleVariables = new Set(
    trimmedSampleEnvLines.filter(isAssignment).map(x => parseAssignment(x)[0]),
  );
  const currentVariables = new Set(
    trimmedEnvFileLines.filter(isAssignment).map(x => parseAssignment(x)[0]),
  );
  // Perform deep equality comparison on variables
  return _.isEqual(sampleVariables, currentVariables);
}

function getDefaultValue(variable) {
  const sampleRelevantAssignment = trimmedSampleEnvLines.find(
    x => isAssignment(x) && parseAssignment(x)[0] === variable,
  );
  const currentRelevantAssignment =
    trimmedEnvFileLines &&
    trimmedEnvFileLines.find(
      x => isAssignment(x) && parseAssignment(x)[0] === variable,
    );

  // Only use current value if user chose it and it exists, may be that sample env changed and current one
  // doesn't have that value
  const relevantAssignment =
    (shouldUseCurrentEnv && currentRelevantAssignment) ||
    sampleRelevantAssignment;
  return parseAssignment(relevantAssignment)[1];
}
