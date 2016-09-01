import React from "react";
import BaseComponent from "lib/BaseComponent"
import fs from 'fs';

// TODO: Add Jest Testing
export function debounce (func, timeout) {
  let scheduled = false;
  let lastCalled = null;
  let debouncedFunction = function () {
    let now = new Date();
    if (lastCalled === null || (!scheduled && now - lastCalled >= timeout)) {
      lastCalled = now;
      func.apply(this, arguments);
    }
    else if (!scheduled) {
      scheduled = true;
      setTimeout(() => {
        func.apply(this, arguments);
        scheduled = false;
      }, timeout - (now - lastCalled));
    }
  }
  return debouncedFunction;
}


let isClientFlag = false;

// Lets us know if we are running on server
export function isClient() {
  return isClientFlag;
}

export function setIsClient(status) {
  isClientFlag = status;
}

export function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

export function getDatabaseConfig() {
  const raw = fs.readFileSync('../../database.config.json', 'utf8');
  // remove comments for JSON parsing
  let stringArray = raw.split('\n');
  stringArray = stringArray.map((string) => {
    return string.trim();
  });
  stringArray = stringArray.filter((string) => {
    return string.substr(0, 2) !== "//";
  });
  const json = JSON.parse(stringArray.join(''));
  return json;
}

export function getGhostConfig() {
  // This will fail if there are comments in
  // ghost.config.json which should've been removed by
  // getGhostConfig though
  const json = JSON.parse(fs.readFileSync('../../ghost.config.json', 'utf8'));
  return json;
}
