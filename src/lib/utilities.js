import React from "react";
import BaseComponent from "lib/BaseComponent"

// TODO: Add Jest Testing
// Remember to call the function with the correct 'this' value
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

let globalError = null;
let appControllerMounted = false;

// These will be the functions with 'this' bound to appController
// So they can change the state of it globally
let boundSetGlobalError, boundResetGlobalError, boundGetGlobalError;

// Remember to call this function with the correct 'this' value
export function setContextForGlobalErrorFunctions() {
  if (appControllerMounted) {
    throw new Error("appController already mounted, context is already set");
  }
  // Arrow function automatically binds this
  boundSetGlobalError = (err) => {
    this.safeSetState({error: err});
  }
  boundResetGlobalError = () => {
    this.safeSetState({error: null, displayErrorMessage: false});
  }
  appControllerMounted = true;
}

// This function doesn't actually reset the context,
// but will just be called when appController has been unmounted and
// the context therefore has become invalid.
export function resetContextForGlobalErrorFunctions() {
  appControllerMounted = false;
  globalError = null;
}

export function resetGlobalError() {
  if (!appControllerMounted) {
    throw new Error("You have to set the context for global error functions\
      before you can modify the global error");
  }
  boundResetGlobalError();
  globalError = null;
}

export function setGlobalError(err) {
  if (!appControllerMounted) {
    throw new Error("You have to set the context for global error functions\
      before you can modify the global error");
  }
  boundSetGlobalError(err);
  globalError = err;
}

export function getGlobalError() {
  if (!appControllerMounted) {
    throw new Error("You have to set the context for global error functions\
      before you can fetch the global error");
  }
  return globalError;
}
