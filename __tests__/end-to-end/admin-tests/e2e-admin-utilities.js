import Nightmare from 'nightmare';

import { HOST } from './e2e-admin-constants';

export function getLoggedInState(path) {
  const nightmare = new Nightmare();

  const passwordInputSelector = 'input[type="password"]';
  return nightmare
    // We use this to detect errors in rendering
    .on('page', (type, message, stack) => {
      if (type !== 'error') return;
      throw new Error(`${message}\nstack trace: ${stack}`);
    })
    .goto(`${HOST}${path}`)
    // Wait for the input element to render
    .wait(passwordInputSelector)
    // Write password
    .insert(passwordInputSelector, process.env.CIRCLECI_ADMIN_PASSWORD)
    // Press enter
    .type(passwordInputSelector, '\u000d');
}
