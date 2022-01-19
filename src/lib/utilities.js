import crypto from 'crypto';
import { getConfig } from '../config';

import { parseMarkdown } from 'lib/react-utilities';

// TODO: Add Jest Testing
export function debounce(func, timeout, addInstantFlag = false) {
  /* Be careful of the addInstantFlag, as if you don't call all arguments
  of the debounced function it will append true anyway, to another argument
  than intended, and this might cause unexpected results */
  let scheduled = false;
  let lastCalled = null;
  const debouncedFunction = function(...args) {
    // eslint-disable-line func-names
    const now = new Date();
    return new Promise(resolve => {
      if (lastCalled === null || (!scheduled && now - lastCalled >= timeout)) {
        lastCalled = now;
        if (addInstantFlag) {
          // add a flag that says this function was called instantly,
          // and didn't wait for the debounce, in case you want a different
          // reaction to an instant call (for example not using state as that
          // is asynchronous and won't get the newest values)
          args.push(true);
        }
        resolve(func.apply(this, args));
      } else if (!scheduled) {
        scheduled = true;
        setTimeout(() => {
          scheduled = false;
          resolve(func.apply(this, args));
        }, timeout - (now - lastCalled));
      }
    });
  };
  return debouncedFunction;
}

export function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function mapLegacyIssueSlugsToIssueNumber(slug) {
  const match = slug.match(/issue-(\d\d)/);
  if (match) {
    return match[1];
  }
  switch (slug) {
    case 'the-identity-issue':
      return '76';
    case 'the-love-issue':
      return '78';
    case 'the-food-issue':
      return '82';
    default:
      return slug;
  }
}

// Modified from ghost/core/server/models/base.js
export function slugify(name) {
  // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
  let slug = name
    .replace(/[:/?#[\]@!$&'()*+,;=\\%<>|^~£"]/g, '')
    .replace(/(\s|\.)/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  while (slug.charAt(slug.length - 1) === '-') {
    slug = slug.substr(0, slug.length - 1);
  }
  return slug;
}

// this currently only supports parsing links
export function markdownLength(str) {
  if (!str) return 0;
  const array = parseMarkdown(str);
  let length = 0;
  array.forEach(element => {
    if (typeof element === 'string') {
      length += element.length;
    } else {
      // assume it is a link
      length += element.props.children.length;
    }
  });
  return length;
}

export function hash(password) {
  const hashInstance = crypto.createHash('sha512');
  return hashInstance.update(password).digest('hex');
}

// For tracking the articles visited in that particular session
// so we at least don't count views more than once per session
const viewed = {};
export function viewArticle(slug) {
  viewed[slug] = true;
}

export function isArticleViewed(slug) {
  return viewed[slug] === true;
}

export function followPath(path, object) {
  /*
  Returns the value at the end of a path at a given object
  */

  // If using dot notation obj.key.key.key
  let processedPath = path;
  if (typeof path === 'string') {
    processedPath = path.split('.');
  }
  return processedPath.reduce((currentObject, nextChild) => {
    if (currentObject !== undefined && has.call(currentObject, nextChild)) {
      return currentObject[nextChild];
    }

    return undefined;
  }, object);
}

export function isPlainObject(element) {
  // Handle getPrototypeOf throwing error on undefined or null
  if (!element) {
    return false;
  }
  return Object.getPrototypeOf(element) === Object.prototype;
}

/**
 * Taken from https://stackoverflow.com/questions/767486/how-do-you-check-if-a-variable-is-an-array-in-javascript
 * @param {any} candidate
 * @returns {boolean}
 */
export function isArray(candidate) {
  return candidate.constructor === Array;
}

/**
 * Taken from https://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
 * @param {any} candidate
 * @returns {boolean}
 */
export function isFunction(candidate) {
  return typeof candidate === 'function';
}

export function stringToInt(str) {
  if (/^[0-9]+$/.test(str)) {
    return parseInt(str, 10);
  }
  return NaN;
}

export const has = Object.prototype.hasOwnProperty;

// Environment functions and constants
export const isProduction = () => getConfig().NODE_ENV === 'production';
export const isStaging = () => getConfig().NODE_ENV === 'staging';
export const isCI = () => getConfig().GAZELLE_ENV === 'CI';
export const isDevelopment = () => !isProduction() && !isStaging();

export function filterByEnvironment(development, beta, production) {
  if (production === undefined) {
    /**
     * In case of only two arguments being specificed we re-value the arguments
     * so they now function as non-production and production
     */
    if (development === undefined || beta === undefined) {
      // Less than 2 arguments were given which is not supported
      throw new Error(
        'Less than 2 arguments were passed to filterByEnvironment',
      );
    }

    if (isProduction()) {
      return beta;
    }
    return development;
  }

  // All 3 arguments were specified
  if (isProduction()) {
    return production;
  } else if (isStaging()) {
    return beta;
  }
  return development;
}

export const nothingAllowedRobotsTxt = 'User-agent: *\nDisallow: /\n';
export const allAllowedRobotsTxt = 'User-agent: *\nAllow: /\n';

export const googleClientID =
  '235485701704-vqb1qkp8lk1hbdhcmjm5jmtocaur3mq7.apps.googleusercontent.com';
export const googleWhitelist = [
  'at4049@nyu.edu',
  'geb316@nyu.edu',
  'vs2241@nyu.edu',
  'hu301@nyu.edu',
  'lma502@nyu.edu',
  'dp2686@nyu.edu',
  'ego225@nyu.edu',
  'ns3774@nyu.edu',
  'ss12044@nyu.edu',
  'alh8@nyu.edu',
  'kkh312@nyu.edu',
  'sa4901@nyu.edu',
  'ata381@nyu.edu',
  'mmh690@nyu.edu',
  'hsj276@nyu.edu',
  'mzv205@nyu.edu',
  'maa1150@nyu.edu',
  'ea2525@nyu.edu',
  'amc9974@nyu.edu',
  'ak8431@nyu.edu',
  'dhh5820@nyu.edu',
  'sh6103@nyu.edu',
  'sah736@nyu.edu',
  'jmo460@nyu.edu',
  'cl5503@nyu.edu',
];
