'use strict';

const fs = require('fs');

const WebClient = require('@slack/client').WebClient;

const token = require('./config.js').apiToken;

let message, channel;
if (process.argv.length === 3) {
  // Only a message was passed so we use default channel
  channel = "deployment"
  message = process.argv[2];
} else if (process.argv.length === 4) {
  channel = process.argv[2];
  message = process.argv[3];
} else {
  console.error("Usage: node index.js 'message to send'\nOR\nnode index.js <channel_to_send_to> 'message to send'");
  process.exit(1);
}

const web = new WebClient(token);
web.chat.postMessage(channel, message, {as_user: true}, function (err, res) {
  if (err) {
    const fd = fs.openSync('slack-bot-errors.log', 'a');
    fs.writeSync(fd, new Date().toString() + ": " + err.toString() + "\n");
    fs.closeSync(fd);
    process.exit(1);
  }
});
