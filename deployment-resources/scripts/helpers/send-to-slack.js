/* eslint-disable strict */
/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const { WebClient } = require('@slack/client');
const path = require('path');

const token = process.env.SLACK_API_TOKEN;
let message;
let channel;
if (process.argv.length === 3) {
  // Only a message was passed so we use default channel
  channel = 'deployment';
  [, , message] = process.argv;
} else if (process.argv.length === 4) {
  [, , channel, message] = process.argv;
} else {
  console.error(
    "Usage: node index.js 'message to send'\nOR\nnode index.js <channel_to_send_to> 'message to send'",
  );
  process.exit(1);
}

const web = new WebClient(token);
web.chat.postMessage(channel, message, { as_user: true }, err => {
  if (err) {
    const fd = fs.openSync(path.join(__dirname, 'slack-bot-errors.log'), 'a');
    fs.writeSync(fd, `${new Date().toString()}: ${err.toString()}\n`);
    fs.closeSync(fd);
    console.error(err);
    process.exit(1);
  }
});
