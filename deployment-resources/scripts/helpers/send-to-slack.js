/* eslint-disable strict */
/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/client');
const path = require('path');

const token = process.env.SLACK_API_TOKEN;
if (!token) {
  throw new Error('Must have token in environment variables');
}
let text;
let channel;
if (process.argv.length === 3) {
  // Only a message was passed so we use default channel
  channel = 'deployment';
  [, , text] = process.argv;
} else if (process.argv.length === 4) {
  [, , channel, text] = process.argv;
} else {
  console.error(
    "Usage: node index.js 'message to send'\nOR\nnode index.js <channel_to_send_to> 'message to send'",
  );
  process.exit(1);
}

const web = new WebClient(token);
web.chat.postMessage({ channel, text, as_user: true }).catch(err => {
  const fd = fs.openSync(path.join(__dirname, 'slack-bot-errors.log'), 'a');
  fs.writeSync(fd, `${new Date().toString()}: ${err.toString()}\n`);
  fs.closeSync(fd);
  console.error(err);
  process.exit(1);
});
