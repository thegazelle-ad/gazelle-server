import { followPath, isPlainObject } from 'lib/utilities';

export function trimField(length, fieldValue) {
  if (!fieldValue) {
    return '';
  }

  return fieldValue.substr(0, length);
}

/**
 * A function that will have 'this' bound to a React Component, the first
 * argument 'key', will be bound to the key in this.state, for which the form
 * field it will be used as the onChange handler for, that keeps its value.
 *
 * @arg {string} keyPath - The keyPath in this.state where value is stored, a
 * dot path such as 'key1.key2.key' or simply 'key'
 * if not stored in nested object
 *
 * @arg {Object} options - options to be passed describing
 * how this function will be used
 *
 * @arg {boolean} options.isMaterialSelect - Whether connected field is a
 * MaterialUI Select component or not
 *
 * @arg {number} options.trim - If you wish to trim the field, input the
 * value of the max length here when you wish the value to be trimmed.
 *
 * @arg {Object} e - this is the syntheticEvent React will pass to the function
 * when something changes in the form field we bind this function to
 */
export function updateFieldValue(keyPath, options = {}, e, ...restArgs) {
  // Handle options
  let value;
  let trimLength = false;
  Object.keys(options).forEach(key => {
    switch (key) {
      case 'isMaterialSelect':
        if (options.isMaterialSelect) {
          /**
           * MaterialUI doesn't keep select values in e.target.value but passes
           * them as separate argument.
           * We currently don't support the multiple argument, as we don't use it.
           * If we start using it though, it should be implemented here as an option.
           */
          value = restArgs[1];
        }
        break;

      case 'trim':
        trimLength = options.trim;
        break;

      default:
        throw new Error('Undefined options not allowed in updateFieldValue');
    }
  });

  if (value === undefined) {
    /**
     * This means that the materialSelect option wasn't set,
     * and it also makes sure we get the value before event dissappears and avoids
     * us needing to use event.persist
     */
    value = e.target.value;
  }

  if (trimLength !== false) {
    // Trim option was set so we trim it
    value = trimField(trimLength, value);
  }

  // Take previous state and treat everything as immutable
  this.safeSetState(prevState => {
    const updater = {};

    const keyArray = keyPath.split('.');
    // Pointer to current level of object we're in
    let latestNestedObject = updater;
    let currentKeyPath = '';
    keyArray.forEach((key, index) => {
      if (index === keyArray.length - 1) {
        latestNestedObject[key] = value;
      } else {
        currentKeyPath += `${index === 0 ? '' : '.'}${key}`;
        /**
         * We copy all the old properties but don't just mutate for immutability in order
         * to keep immutability.
         * Also notice the importance of us using prevState here with the updater function
         * as opposed to object updating, as this avoids a possible race condition
         */
        const stateEquivalent = followPath(currentKeyPath, prevState);
        if (!isPlainObject(stateEquivalent)) {
          throw new Error('Invalid keyPath provided');
        }
        latestNestedObject[key] = Object.assign({}, stateEquivalent);
        latestNestedObject = latestNestedObject[key];
      }
    });
    return updater;
  });
}
