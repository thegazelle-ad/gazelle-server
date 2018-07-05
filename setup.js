/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// We use 'for of' because 1. it actually doesn't require regenerator
// runtime as this is native node, and 2. we don't want to enter callbacks
// where consecutive awaits are hard/impossible to do
const inquirer = require('inquirer');
const fs = require('fs');

const sampleEnv = fs.readFileSync('.sample-env', { encoding: 'utf8' });

// The different states our parser can be in
const NEUTRAL = 0;
const MAIN_DESCRIPTION = 1;
const SECTION_HEADER = 2;
const COMMENT = 3;

// Tests for each type
const isSectionComment = line => /^#.*#$/.test(line);
const extractSectionCommentText = line => /^#+([\w\s.,'!:]*)#+$/.exec(line)[1];
const isAssignment = line => line.includes('=');
const parseAssignment = line => /^(\w+?)=(.*)/.exec(line).slice(1, 3);
const isTitle = line => /^#[^#]/.test(line);
const extractTitle = line => /^#(.+)/.exec(line)[1].trim();

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
  let state = NEUTRAL;
  let mainDescriptionSeen = false;
  let currentText = '';
  for (const line of sampleEnv.split('\n').map(x => x.trim())) {
    let lineToWrite = line;
    if (state === MAIN_DESCRIPTION || state === SECTION_HEADER) {
      if (isSectionComment(line)) {
        const text = extractSectionCommentText(line);
        currentText += '\n';
        currentText += line;
        if (!text) {
          if (state === SECTION_HEADER) {
            console.log(`${currentText}\n`);
          }
          state = NEUTRAL;
        }
      } else {
        throwError('Found a non closed section comment');
      }
    } else if (state === COMMENT) {
      console.log('hi');
    } else if (state === NEUTRAL) {
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
      } else if (isTitle(line)) {
        // We assume titles are never more than one line
        const title = extractTitle(line);
        console.log(title);
        console.log('-'.repeat(title.length));
        // newline
        console.log();
      } else {
        state = NEUTRAL;
      }
    } else {
      throwError('Parser is in an unknown state');
    }
  }
}
