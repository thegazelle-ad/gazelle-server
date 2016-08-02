import React from "react";
import FalcorController from "lib/falcor/FalcorController";

// create a curried createElement that injects a
// falcor model instance into each of the falcon controllers
// also passes a flag that lets the FalcorController know
// if its a server element or not
export function injectModelCreateElement(model) {
  return (Component, props) => {
    if (Component.prototype instanceof FalcorController) {
      return <Component model={model} {...props} />
    } else {
      return <Component {...props} />
    }
  }
}

// Turns to true on the client after the first render is entirely
// completed. Should be set only by the toplevel appController
// after it has mounted
let appReady = false

export function isAppReady() {
  return appReady
}

export function setAppReady() {
  appReady = true
}

export function validateFalcorPathSets(falcorPathSets) {
  // If the component doesn't want any data
  if (!falcorPathSets || !(falcorPathSets instanceof Array) || falcorPathSets.length === 0) {
    return undefined;
  }
  // If we're only passing a single pathSet we compensate for the spread operator
  if (!(falcorPathSets[0] instanceof Array)) {
    return [falcorPathSets];
  }
  return falcorPathSets;
}

function recurseOnCache(curObject, remainingKeySets) {
  if (remainingKeySets.length === 0) {
    return true;
  }
  const nextRemainingKeySets = remainingKeySets.slice(1);
  let nextKeySet = remainingKeySets[0];
  if (!(nextKeySet instanceof Array)) {
    nextKeySet = [nextKeySet];
  }
  return nextKeySet.every((key) => {
    if (key !== null && typeof key === "object") {
      let start = 0;
      if (key.hasOwnProperty("from")) {
        start = key.from;
      }
      let end;
      if (key.hasOwnProperty("to")) {
        if (key.hasOwnProperty("length")) {
          throw new Error("Falcor Range cannot have both 'to' and 'length' properties at falcor KeySet: " + JSON.stringify(key));
        }
        end = key.to;
      }
      else if (key.hasOwnProperty("length")) {
        end = start+key.length-1;
      }
      else {
        throw new Error("Falcor Range must have either 'to' or 'length' properties at falcor KeySet: " + JSON.stringify(key));
      }
      for (let i = start; i <= end; i++) {
        if (curObject.hasOwnProperty(i)) {
          if (!recurseOnCache(curObject[i], nextRemainingKeySets)) {
            return false;
          }
        }
        else {
          return false;
        }
      }
    }
    else {
      if (curObject.hasOwnProperty(key)) {
        if (!recurseOnCache(curObject[key], nextRemainingKeySets)) {
          return false;
        }
      }
      else {
        return false;
      }
    }
    return true;
  });
}

export function pathSetsInCache(cache, falcorPathSets) {
  falcorPathSets = validateFalcorPathSets(falcorPathSets);
  if (falcorPathSets === undefined) {
    return true;
  }
  return falcorPathSets.every((pathSet) => {
    if (!recurseOnCache(cache, pathSet)) {
      return false;
    }
    return true;
  });
}

export function expandCache(cache) {
  function followPath(path) {
    // If using dot notation obj.key.key.key
    // It is currently redundant though as we only pass arrays
    if (typeof path === "string") {
      path = path.split('.');
    }
    return path.reduce((currentObject, nextChild) => {
      if (currentObject !== undefined && currentObject.hasOwnProperty(nextChild)) {
        return currentObject[nextChild];
      }

      return undefined;
    }, cache);
  }

  function isObject(val) {
    if (val === null || (val instanceof Array)) return false;
    return typeof val === "object";
  }

  // If empty return itself
  if (!cache) return cache;
  // Expanding
  const stack = [];
  Object.keys(cache).forEach((key) => {
    stack.push([key]);
  })
  while (stack.length > 0) {
    const pathArray = stack.pop();
    // Parent also works for array length 1, aka initial keys
    // Parent and Key variables are used for assigning new values later
    const parent = followPath(pathArray.slice(0, pathArray.length-1));
    const key = pathArray[pathArray.length-1];
    // Since key was pushed on to stack from objects keys, it will exist
    const val = parent[key];
    if (val === undefined) {
      throw new Error("Missing part of JSON graph in expand");
    }
    if (!isObject(val)) {
      continue;
    }
    else if (val.$type) {
      switch (val.$type) {
        case "atom":
          parent[key] = val.value;
          break;
        case "error":
          parent[key] = new Error(val.value);
          break;
        case "ref":
          parent[key] = followPath(val.value);
          break;
        default:
          throw new Error("expandCache encountered a new type of name: " + val.$type + ". And cannot read it");
      }
    }
    else{
      Object.keys(val).forEach((key) => {
        const next = pathArray.concat(key);
        stack.push(next);
      });
    }
  };
  return cache;
}
