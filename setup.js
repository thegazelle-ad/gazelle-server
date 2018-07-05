/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-multi-str */
// We use 'for of' because 1. it actually doesn't require regenerator
// runtime as this is native node, and 2. we don't want to enter callbacks
// where consecutive awaits are hard/impossible to do
const inquirer = require('inquirer');
const fs = require('fs');

let sampleEnv;
try {
  sampleEnv = fs.readFileSync('.sample-env', { encoding: 'utf8' });
} catch (e) {
  console.error('\n\n');
  console.error(
    'ERROR: There was an error opening the .sample-env file, are you sure you\
 are running this command through npm run setup or from the root directory?',
  );
  console.error('\n\n');
  throw e;
}

// The different states our parser can be in
const NEUTRAL = 0;
const MAIN_DESCRIPTION = 1;
const SECTION_HEADER = 2;
const COMMENT = 3;
// We use this state if the user doesn't want to do deployment config
const WRITE_REST = 4;

// Tests for each type
const isSectionComment = line => /^#.*#$/.test(line);
const extractSectionCommentText = line =>
  /^#+([\w\s.,'!:]*)#+$/.exec(line)[1].trim();
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

// Say hi!
const WELCOME_MESSAGE = `\
Hi! Welcome to the setup script for The Gazelle's Engineering Team!
We'll take you through a short interactive guide for setting up the
configuration needed to run our code, if you find that there's anything
that could be helpful in this guide please do edit the code in setup.js to make it more helpful!\
`;
console.log(`${WELCOME_MESSAGE}\n`);

// I want to use async/await, but only works in an async function
main();

async function main() {
  // The file descriptor for the env file
  const fd = fs.openSync('.env', 'w');
  let state = NEUTRAL;
  let mainDescriptionSeen = false;
  let currentText = '';
  const trimmedLines = sampleEnv.split('\n').map(x => x.trim());
  for (let i = 0; i < trimmedLines.length; i++) {
    const line = trimmedLines[i];
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
              console.log(`${currentText}\n`);
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
        console.log(currentText);
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
        console.log(title);
        console.log('-'.repeat(title.length));
        // newline
        console.log();
      } else if (isComment(line)) {
        state = COMMENT;
        currentText = `NOTE: ${extractComment(line)}`;
      } else if (isAssignment(line)) {
        const [variable, defaultValue] = parseAssignment(line);
        const isPassword = variable.toLowerCase().includes('password');
        const assignedValue = await inquirer.prompt({
          type: isPassword ? 'password' : 'input',
          mask: isPassword ? '*' : undefined,
          name: variable,
          default: defaultValue,
          message: `What value would you like to set ${variable} to?`,
        });
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
  const GOODBYE_MESSAGE = `\
You should now have your environment totally setup! Try out running \
npm run build && npm start and see if you have The Gazelle running \
successfully by checking out localhost:3000 and localhost:4000 in \
your browser!`;
  console.log(GOODBYE_MESSAGE);
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
