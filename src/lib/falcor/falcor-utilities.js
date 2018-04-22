/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import FalcorController from 'lib/falcor/FalcorController';
import _ from 'lodash';
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
    if (!has.call(curObject, key)) {
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

function isEmptyObject(obj) {
  if ('isEmptyObjectSeen' in obj) {
    // We have already been here so it must be empty as we didn't
    // find any values yet (as in that case it would have stopped recursing)
    return true;
  }
  // We check whether there are any keys that actually recursively
  // store a value, if there is one we return false, otherwise true
  obj.isEmptyObjectSeen = true; // eslint-disable-line no-param-reassign
  const recursivelyHasValue = falcor.keys(obj).some(key => {
    // This is the extra key we added so don't care about that one
    if (key === 'isEmptyObjectSeen') return false;
    const value = obj[key];
    if (value !== null && typeof value === 'object') {
      // It is an object so we recurse
      const isEmpty = isEmptyObject(value);
      return !isEmpty;
    }
    return value !== undefined;
  });
  delete obj.isEmptyObjectSeen; // eslint-disable-line no-param-reassign
  return !recursivelyHasValue;
}

/**
 * We want to phase this function out as it's only here for compatibility
 * with our legacy code, so please don't use it again, try using the falcor HOCs
 * and just working with the value that Falcor gives you
 * @param {Object} obj - "dirty" falcor return value
 * @returns {Object} cleaned up version of falcor return value
 */
export function cleanupFalcorKeys(obj) {
  if (
    obj === null ||
    typeof obj !== 'object' ||
    obj.cleanupFalcorKeysMetaSeen
  ) {
    return obj;
  }
  const ret = {};
  // In order to handle circular objects, the key name is convoluted to make sure it's unique
  obj.cleanupFalcorKeysMetaSeen = true; // eslint-disable-line no-param-reassign
  falcor.keys(obj).forEach(key => {
    if (key === 'cleanupFalcorKeysMetaSeen') return;
    const value = obj[key];
    if (value !== null && typeof value === 'object') {
      // Check if it's an empty object and if then don't add it
      if (falcor.keys(value).length === 0) {
        return;
      }
      // Check recursively if all the keys in the object are undefined, then don't add it
      if (isEmptyObject(value)) {
        return;
      }
    }
    ret[key] = cleanupFalcorKeys(obj[key]);
  });
  // Cleanup to not have mutated the object
  delete obj.cleanupFalcorKeysMetaSeen; // eslint-disable-line no-param-reassign
  return ret;
}

/**
 * Takes a Falcor psuedo array and outputs an array containing the values of the
 * keys are filtering out the Falcor meta data. Note that even if you have an object
 * with number keys such as from 60 - 90, an array with indices 0 - 30 will still
 * be created
 * @param {Object} obj - The psuedo array from Falcor, should work with object
 * that has any key values, whether strings or numbers
 * @returns {any[]}
 */
export const parseFalcorPseudoArray = obj =>
  _.toArray(_.pick(obj, falcor.keys(obj)));
