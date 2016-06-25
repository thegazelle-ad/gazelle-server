import React from "react"
import FalcorController from "lib/falcor/FalcorController"

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
  console.log("APP SET AS READY")
  appReady = true
}

// Below function based on function from: https://github.com/ekosz/falcor-expand-cache
// MIT License
// Copyright (c) 2015 Eric Koslow
export function expandCache(cache) {
  function followPath(path) {
    // If using dot notation obj.key.key.key
    if (typeof path === "string") {
      path = path.split('.');
    }
    return path.reduce((acc, part) => {
      if (acc !== undefined && acc.hasOwnProperty(part)) {
        return acc[part];
      }

      return undefined;
    }, cache);
  }

  function isObject(val) {
    if (val === null || val instanceof Array) return false;
    return typeof val === "object";
  }

  // If empty return itself
  if (!cache) return cache;
  // Expanding
  var stack = [];
  Object.keys(cache).forEach((key) => {
    stack.push([key]);
  })
  while (stack.length > 0) {
    let pathArray = stack.pop();
    // Parent also works for array length 1, aka initial keys
    // Used for assigning
    let parent = followPath(pathArray.slice(0, pathArray.length-1));
    let key = pathArray[pathArray.length-1];
    // Since key was pushed on to stack from objects keys, it will exist
    let val = parent[key];
    if (val === undefined) {
      throw new Error("Missing part of JSON graph in expand");
    }
    if (!isObject(val) || val.hasOwnProperty("__seen")) {
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
          if (!val.hasOwnProperty("__seen")) stack.push(pathArray);
          break;
        default:
          return undefined;
      }
    }
    else{
      parent[key]["__seen"] = true;
      Object.keys(val).forEach((key) => {
        let next = pathArray.slice();
        next.push(key);
        stack.push(next);
      });
    }
  };

  // Cleaning the object
  // TODO clean up the garbage that wasn't rejected by the path
  stack = [];
  if (cache.hasOwnProperty("__seen")) {
    if (!(delete cache["__seen"])) {
      throw new Error("can't delete __seen from cache");
    }
  }
  Object.keys(cache).forEach((key) => {
    stack.push([key]);
  })
  while (stack.length > 0) {
    let pathArray = stack.pop();
    // Parent also works for array length 1, aka initial keys
    // Used for assigning
    let parent = followPath(pathArray.slice(0, pathArray.length-1));
    let key = pathArray[pathArray.length-1];
    // Since key was pushed on to stack from objects keys, it will exist
    let val = parent[key];
    if (val === undefined) {
      throw new Error("Missing part of JSON graph in cleanup");
    }
    if (!isObject(val) || !val.hasOwnProperty("__seen")) {
      continue;
    }
    else{
      if (!(delete parent[key]["__seen"])) {
        throw new Error("Couldn't delete __seen key");
      }
      Object.keys(val).forEach((key) => {
        let next = pathArray.slice();
        next.push(key);
        stack.push(next);
      });
    }
  };
  return cache;
}
