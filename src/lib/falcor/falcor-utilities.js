/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
import update from 'react-addons-update';
import falcor from 'falcor';

import { has, followPath } from 'lib/utilities';

// create a curried createElement that injects a
// falcor model instance into each of the falcon controllers
// also passes a flag that lets the FalcorController know
// if its a server element or not
export function injectModelCreateElement(model) {
  return (Component, props) => {
    if (
      Component.prototype instanceof FalcorController ||
      // If it is a HOC we don't know whether there's a FalcorController beneath
      // so we inject just in case. We want to get completely rid of all our inheritance
      // at some point though, but this is just for the transition stage
      (Component.displayName && /\w+?\(\w+?\)/.test(Component.displayName))
    ) {
      return <Component model={model} {...props} />;
    }
    return <Component {...props} />;
  };
}

// Turns to true on the client after the first render is entirely
// completed. Should be set only by the toplevel appController
// after it has mounted
let appReady = false;

export function isAppReady() {
  return appReady;
}

export function setAppReady() {
  appReady = true;
}

export function validateFalcorPathSets(falcorPathSets) {
  /*
  Takes either a single pathSet or an array of pathSets and returns
  a standardized version of an array of falcor pathSets.
  If the component doesn't want any data undefined will be returned which can then be
  handled seperately.
  */

  // If the component doesn't want any data
  if (
    !falcorPathSets ||
    !(falcorPathSets instanceof Array) ||
    falcorPathSets.length === 0
  ) {
    return undefined;
  }
  // If we're only passing a single pathSet we compensate for the spread operator
  if (!(falcorPathSets[0] instanceof Array)) {
    return [falcorPathSets];
  }

  // Remove any empty arrays (would also remove falsey values, but they shouldn't
  // be present in a falcorPathSet anyway)
  return _.compact(
    falcorPathSets.map(pathSet => {
      if (!(pathSet instanceof Array) || pathSet.length === 0) {
        return null;
      }
      return pathSet;
    }),
  );
}

export function pathSetsInCache(cache, falcorPathSets) {
  /*
  Checks if falcorPathSets in given cache
  */

  /* eslint-disable no-use-before-define */
  function handleCheckingSingleKey(curObject, nextRemainingKeySets, key) {
    /*
    This function modularizes the checking of a single key.
    It takes as arguments the current object level we are at,
    the key we are checking and the remainingKeySets argument
    for the next call of checkSinglePathSetsInCache.
    It returns whether this key and all branches from the pathSet that follow
    this key are in the cache as it continues recursively.
    */
    if (!has.call(curObject, key) || curObject[key] === null) {
      return false;
    }
    const val = curObject[key];
    if (val.$type) {
      switch (val.$type) {
        case 'error':
        case 'atom':
          return nextRemainingKeySets.length === 0;
        case 'ref':
          return checkSinglePathSetInCache(
            followPath(val.value, cache),
            nextRemainingKeySets,
          );
        default:
          throw new Error(
            `pathSetsInCache encountered unexpected type. Type found was: ${
              val.$type
            }`,
          );
      }
    } else {
      return checkSinglePathSetInCache(val, nextRemainingKeySets);
    }
  }
  /* eslint-enable */

  function checkSinglePathSetInCache(curObject, remainingKeySets) {
    /*
    Checks if a single pathSet is in the cache recursively.
    Since it is recursive it not only takes the initial values of
    the cache and a falcor pathSet, but also the current level of
    the object one has reached, and the remaining keySets in the
    current falcor pathSet.
    */

    // Base case, means we are done as there are no
    // remaining keySets.
    if (remainingKeySets.length === 0) {
      return true;
    }
    const nextRemainingKeySets = remainingKeySets.slice(1);
    let nextKeySet = remainingKeySets[0];

    // This is to avoid code duplication for when
    // it is just a single key instead of an
    // array of keys. We don't want to handle that
    // case seperately so just make an array with one value
    if (!(nextKeySet instanceof Array)) {
      nextKeySet = [nextKeySet];
    }
    return nextKeySet.every(keyOrRange => {
      if (keyOrRange !== null && typeof keyOrRange === 'object') {
        // keyOrRange is a range

        // Every time we call a range, there should also be a length property.
        // This is so we know when overfetching whether data is missing
        // in the cache or it's simply because there is no data to fetch.
        // It is also needed in the software development to know how many
        // items you will actually receive when overfetching.
        if (!has.call(curObject, 'length')) {
          if (process.env.NODE_ENV !== 'production') {
            // eslint-disable-next-line no-console
            console.warn(
              'No length property on object in cache. This might be a developer mistake.',
            );
            console.log('Current object in pathSetsInCache:'); // eslint-disable-line no-console
            console.log(curObject); // eslint-disable-line no-console
            console.log('remainingKeySets in pathSetsInCache'); // eslint-disable-line no-console
            console.log(remainingKeySets); // eslint-disable-line no-console
          }
          // If it's not a developer mistake the length property could simply be missing
          // because this data is not in cache.
          return false;
        }
        const lengthOfFalcorArray = curObject.length;
        let start = 0;
        if (has.call(keyOrRange, 'from')) {
          start = keyOrRange.from;
        }
        let end;
        if (has.call(keyOrRange, 'to')) {
          if (has.call(keyOrRange, 'length')) {
            throw new Error(
              "Falcor Range cannot have both 'to' and 'length' properties at falcor KeySet: " +
                `${JSON.stringify(keyOrRange)}`,
            );
          }
          end = keyOrRange.to;
        } else if (has.call(keyOrRange, 'length')) {
          end = start + keyOrRange.length - 1;
        } else {
          throw new Error(
            "Falcor Range must have either 'to' or 'length' properties at falcor KeySet: " +
              `${JSON.stringify(keyOrRange)}`,
          );
        }
        // Don't check any keys beyond the end of the theoretical falcor array.
        end = Math.min(lengthOfFalcorArray - 1, end);
        for (let i = start; i <= end; i++) {
          if (!handleCheckingSingleKey(curObject, nextRemainingKeySets, i)) {
            return false;
          }
        }
        return true;
      }
      // keyOrRange is a simple key
      return handleCheckingSingleKey(
        curObject,
        nextRemainingKeySets,
        keyOrRange,
      );
    });
  }

  // Here function starts
  const processedFalcorPaths = validateFalcorPathSets(falcorPathSets);
  if (processedFalcorPaths === undefined) {
    // If no data is being requested return true
    return true;
  }
  // Return if every pathSet in the array of pathSets
  // is located in the cache.
  return processedFalcorPaths.every(pathSet =>
    checkSinglePathSetInCache(cache, pathSet),
  );
}

export function expandCache(cache) {
  function assignByPath(path, value) {
    // If using dot notation obj.key.key.key
    let processedPath = path;
    if (typeof path === 'string') {
      processedPath = path.split('.');
    }
    // Parent also works for array length 1, aka initial keys
    // Parent and Key variables are used for assigning new values later
    const parent = followPath(
      processedPath.slice(0, processedPath.length - 1),
      cache,
    );
    const key = processedPath[processedPath.length - 1];
    // The following key exists as it was pushed on to stack as a valid key
    parent[key] = value;
  }

  function isObject(val) {
    // We don't count arrays as objects here. This is to protect ourselves against an expanded atom
    // This does still leave us vulnerable to an expanded object though, but in by far most cases
    // it would be very bad form to put an object in an atom, so this is not supported at this time.
    if (val === null || val instanceof Array) return false;
    return typeof val === 'object';
  }

  function handleRef(pathToRef, refPath) {
    const refPathsSet = new Set();
    // pathToRef is an array path
    if (!(pathToRef instanceof Array)) {
      throw new Error(
        'pathToRef was passed as a non-array. The value passed was: ' +
          `${JSON.stringify(pathToRef)}`,
      );
    }
    // So is refPath
    if (!(pathToRef instanceof Array)) {
      throw new Error(
        `refPath was passed as a non-array. The value passed was: ${JSON.stringify(
          refPath,
        )}`,
      );
    }
    refPathsSet.add(pathToRef.join('.'));
    let val = followPath(refPath, cache);
    let path = refPath.join('.');
    if (val === undefined) {
      throw new Error(
        `Missing part of JSON graph in expandCache function at path: ${path}`,
      );
    }
    while (isObject(val) && val.$type) {
      switch (val.$type) {
        case 'atom':
          assignByPath(path, val.value);
          val = followPath(path, cache);
          break;
        case 'error':
          assignByPath(path, new Error(val.value));
          val = followPath(path, cache);
          break;
        case 'ref':
          if (refPathsSet.has(path)) {
            let paths = '[';
            refPathsSet.forEach(pathFromSet => {
              paths += `${pathFromSet},`;
            });
            paths = `${paths.substring(0, paths.length - 2)}]`;
            throw new Error(
              'Neverending loop from ref to ref with no real values present in expandCache. ' +
                `It is made up of the following paths: ${paths}`,
            );
          } else {
            refPathsSet.add(path);
            path = val.value.join('.');
            val = followPath(val.value, cache);
          }
          break;
        default:
          throw new Error(
            `expandCache encountered a new type of name: ${val.$type}. ` +
              `And cannot read it at following path: ${path}`,
          );
      }
    }
    refPathsSet.forEach(pathFromSet => {
      assignByPath(pathFromSet, val);
    });
  }

  // If empty return itself
  if (!cache) return cache;
  // Expanding
  const stack = [];
  Object.keys(cache).forEach(key => {
    stack.push([key]);
  });
  while (stack.length > 0) {
    // pathArray is the path to the current location being checked
    // and is an array with the keys in order of how they should be accessed
    // it is always an array as we only push arrays onto the stack
    const pathArray = stack.pop();
    if (!(pathArray instanceof Array)) {
      throw new Error(
        'non-array popped off stack in expandCache. ' +
          `Item popped off was: ${JSON.stringify(pathArray)}`,
      );
    }
    const val = followPath(pathArray, cache);
    if (val === undefined) {
      throw new Error(
        `Missing part of JSON graph in expandCache function at path: ${pathArray.join(
          '.',
        )}`,
      );
    }
    if (isObject(val) && val.$type) {
      switch (val.$type) {
        case 'atom':
          assignByPath(pathArray, val.value);
          break;
        case 'error':
          assignByPath(pathArray, new Error(val.value));
          break;
        case 'ref':
          handleRef(pathArray, val.value);
          break;
        default:
          throw new Error(
            `expandCache encountered a new type of name: ${val.$type}. ` +
              `And cannot read it at following path: ${pathArray.join('.')}`,
          );
      }
    } else if (isObject(val)) {
      Object.keys(val).forEach(key => {
        const next = pathArray.concat(key);
        stack.push(next);
      });
    }
  }
  return cache;
}

export function mergeUpdatedData(oldData, dataUpdates, maxDepth) {
  /* This function takes the updates returned by falcorUpdate
  and merges them with as few copies as possible to a new object
  with the updates integrated. We do this with react-addons-update
  to help handle the immutability and not need to do a deep copy */

  function isObject(val) {
    if (val === null) return false;
    return typeof val === 'object';
  }

  function recursivelyConvertObject(curObject, correspondingOldObject, depth) {
    /*
    This function recursively goes through an object and converts all
    non-object values to a $set command for react-addons-update in place.
    It has the depth argument so we can make sure that if it receives
    a circular JSON structure it will terminate correctly
    */

    if (depth >= maxDepth) return;

    /* eslint-disable no-param-reassign */
    _.forEach(curObject, (value, key) => {
      if (value instanceof Error) {
        throw value;
      }
      if (has.call(correspondingOldObject, key)) {
        if (isObject(value)) {
          recursivelyConvertObject(
            value,
            correspondingOldObject[key],
            depth + 1,
          );
        } else {
          curObject[key] = { $set: value };
        }
      } else {
        curObject[key] = { $set: value };
      }
    });

    /* eslint-enable no-param-reassign */
  }

  // Function starts here

  if (!oldData) {
    // There was no this.state.data before
    return dataUpdates;
  }

  recursivelyConvertObject(dataUpdates, oldData, 0);

  // This command returns a copy of oldData with the new updates applied
  return update(oldData, dataUpdates);
}

export function cleanupFalcorKeys(obj) {
  if (obj === null || typeof obj !== 'object' || obj.cleanupFalcorKeysMetaSeen)
    return obj;
  const ret = {};
  // In order to handle circular objects, the key name is convoluted to make sure it's unique
  obj.cleanupFalcorKeysMetaSeen = true; // eslint-disable-line no-param-reassign
  falcor.keys(obj).forEach(key => {
    if (key === 'cleanupFalcorKeysMetaSeen') return;
    ret[key] = cleanupFalcorKeys(obj[key]);
  });
  // Cleanup to not have mutated the object
  delete obj.cleanupFalcorKeysMetaSeen; // eslint-disable-line no-param-reassign
  return ret;
}

export function cleanupJsonGraphArg(jsonGraphArg) {
  if (has.call(jsonGraphArg, '$type')) {
    // Then this is the final part we can substitute
    return jsonGraphArg.value;
  }
  // Else we recurse
  const ret = {};
  Object.keys(jsonGraphArg).forEach(key => {
    ret[key] = cleanupJsonGraphArg(jsonGraphArg[key]);
  });
  return ret;
}
