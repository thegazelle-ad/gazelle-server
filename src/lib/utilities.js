import React from "react";
import BaseComponent from "lib/BaseComponent"

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

export function mapLegacyIssueSlugsToIssueNumber(slug) {
  const match = slug.match(/issue-(\d\d)/);
  if (match) {
    return match[1];
  }
  else {
    switch (slug) {
      case "the-identity-issue":
        return "76";
      case "the-love-issue":
        return "78";
      case "the-food-issue":
        return "82";
      default:
        return slug;
    }
  }
}
