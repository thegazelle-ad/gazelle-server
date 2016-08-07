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
    if (typeof path === "string") {;
      path = path.split('.');
    }
    return path.reduce((currentObject, nextChild) => {
      if (currentObject !== undefined && currentObject.hasOwnProperty(nextChild)) {
        return currentObject[nextChild];
      }

      return undefined;
    }, cache);
  }

  function assignByPath(path, value) {
    // If using dot notation obj.key.key.key
    if (typeof path === "string") {
      path = path.split('.');
    }
    // Parent also works for array length 1, aka initial keys
    // Parent and Key variables are used for assigning new values later
    const parent = followPath(path.slice(0, path.length-1));
    const key = path[path.length-1];
    // The following key exists as it was pushed on to stack as a valid key
    parent[key] = value;
  }

  function isObject(val) {
    // We don't count arrays as objects here. This is to protect ourselves against an expanded atom
    // This does still leave us vulnerable to an expanded object though, but in by far most cases
    // it would be very bad form to put an object in an atom, so this is not supported at this time.
    if (val === null || (val instanceof Array)) return false;
    return typeof val === "object";
  }

  function handleRef(pathToRef, refPath) {
    const S = new Set();
    // pathToRef is an array path
    if (!(pathToRef instanceof Array)) {
      throw new Error("pathToRef was passed as a non-array. The value passed was: " + JSON.stringify(pathToRef));
    }
    // So is refPath
    if (!(pathToRef instanceof Array)) {
      throw new Error("refPath was passed as a non-array. The value passed was: " + JSON.stringify(refPath));
    }
    S.add(pathToRef.join('.'));
    let val = followPath(refPath);
    let path = refPath.join('.');
    if (val === undefined) {
      throw new Error("Missing part of JSON graph in expandCache function at path: " + path);
    }
    while (isObject(val) && val.$type) {
      switch (val.$type) {
        case "atom":
          assignByPath(path, val.value);
          val = followPath(path);
          break;
        case "error":
          assignByPath(path, new Error(val.value));
          val = followPath(path);
          break;
        case "ref":
          if (S.has(path)) {
            let paths = "[";
            S.forEach((pathFromSet) => {
              paths += pathFromSet + ", ";
            });
            paths = paths.substring(0, paths.length-2) + ']';
            throw new Error("Neverending loop from ref to ref with no real values present in expandCache. It is made up of the following paths: " + paths)
          }
          else {
            S.add(path);
            path = val.value.join('.');
            val = followPath(val.value);
          }
          break;
        default:
          throw new Error("expandCache encountered a new type of name: " + val.$type + ". And cannot read it at following path: " + path);
      }
    }
    S.forEach((pathFromSet) => {
      assignByPath(pathFromSet, val);
    });
  }

  // If empty return itself
  if (!cache) return cache;
  // Expanding
  const stack = [];
  Object.keys(cache).forEach((key) => {
    stack.push([key]);
  })
  while (stack.length > 0) {
    // pathArray is the path to the current location being checked
    // and is an array with the keys in order of how they should be accessed
    // it is always an array as we only push arrays onto the stack
    const pathArray = stack.pop();
    if (!(pathArray instanceof Array)) {
      throw new Error("non-array popped off stack in expandCache. Item popped off was: " + JSON.stringify(pathArray));
    }
    const val = followPath(pathArray);
    if (val === undefined) {
      throw new Error("Missing part of JSON graph in expandCache function at path: " + pathArray.join('.'));
    }
    if (!isObject(val)) {
      continue;
    }
    else if (val.$type) {
      switch (val.$type) {
        case "atom":
          assignByPath(pathArray, val.value);
          break;
        case "error":
          assignByPath(pathArray, new Error(val.value));
          break;
        case "ref":
          handleRef(pathArray, val.value);
          break;
        default:
          throw new Error("expandCache encountered a new type of name: " + val.$type + ". And cannot read it at following path: " + pathArray.join('.'));
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
