import React from "react";

// TODO: Add Jest Testing
export function debounce (func, timeout, addInstantFlag = false) {
  /* Be careful of the addInstantFlag, as if you don't call all arguments
  of the debounced function it will append true anyway, to another argument
  than intended, and this might cause unexpected results */
  let scheduled = false;
  let lastCalled = null;
  let debouncedFunction = function () {
    let now = new Date();
    if (lastCalled === null || (!scheduled && now - lastCalled >= timeout)) {
      lastCalled = now;
      const args = Array.from(arguments);
      if (addInstantFlag) {
        // add a flag that says this function was called instantly,
        // and didn't wait for the debounce, in case you want a different
        // reaction to an instant call (for example not using state as that
        // is asynchronous and won't get the newest values)
        args.push(true);
      }
      func.apply(this, args);
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

// Modified slightly from ghost/core/server/models/base.js
export function slugifyPost(postSlug) {
  // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
  let slug = postSlug.replace(/[:\/\?#\[\]@!$&'()*+,;=\\%<>\|\^~£"]/g, '')
              .replace(/(\s|\.)/g, '-')
              .replace(/-+/g, '-')
              .toLowerCase();

  while(slug.charAt(slug.length - 1) === '-') {
    slug = slug.substr(0, slug.length-1);
  }
  slug = /^(ghost|ghost\-admin|admin|wp\-admin|wp\-login|dashboard|logout|login|signin|signup|signout|register|archive|archives|category|categories|tag|tags|page|pages|post|posts|user|users|rss)$/g
         .test(slug) ? slug + '-post' : slug;
  return slug;
}

// Modified from ghost/core/server/models/base.js
export function slugifyAuthor(authorSlug) {
  // Remove URL reserved chars: `:/?#[]@!$&'()*+,;=` as well as `\%<>|^~£"`
  let slug = authorSlug.replace(/[:\/\?#\[\]@!$&'()*+,;=\\%<>\|\^~£"]/g, '')
              .replace(/(\s|\.)/g, '-')
              .replace(/-+/g, '-')
              .toLowerCase();

  while(slug.charAt(slug.length - 1) === '-') {
    slug = slug.substr(0, slug.length-1);
  }
  return slug;
}

export function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  let dateString = yyyy.toString()+'-';
  if (mm < 10) {
    dateString += '0';
  }
  dateString += mm.toString()+'-';
  if (dd < 10) {
    dateString += '0';
  }
  dateString += dd.toString();
  return dateString;
}

export function formatDateTime(date) {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();
  const hh = date.getHours();
  const mins = date.getMinutes();
  const ss = date.getSeconds();

  let dateTimeString = yyyy.toString()+'-';
  if (mm < 10) {
    dateTimeString += '0';
  }
  dateTimeString += mm.toString()+'-';
  if (dd < 10) {
    dateTimeString += '0';
  }
  dateTimeString += dd.toString() + ' ';

  if (hh < 10) {
    dateTimeString += '0';
  }
  dateTimeString += hh.toString()+':';
  if (mins < 10) {
    dateTimeString += '0';
  }
  dateTimeString += mins.toString() + ':';
  if (ss < 10) {
    dateTimeString += '0';
  }
  dateTimeString += ss.toString();

  return dateTimeString;
}

// this currently only supports parsing links
export function parseMarkdown(str) {
  if (!str) return str;
  // parse links
  const exp = /\[(.*?)\]\((.*?)\)/g;
  let result;
  const output = [];
  let end = 0;
  while (result = exp.exec(str)) { // eslint-disable-line no-cond-assign
    output.push(str.substring(end, result.index));
    output.push(<a href={result[2]} key={result[1] + '-' + result[2]}>{result[1]}</a>);
    end = exp.lastIndex;
  }
  output.push(str.substring(end));
  return output;
}

// this currently only supports parsing links
export function markdownLength(str) {
  if (!str) return 0;
  const array = parseMarkdown(str);
  let length = 0;
  array.forEach((element) => {
    if ((typeof element) === "string") {
      length += element.length;
    }
    else {
      // assume it is a link
      length += element.props.children.length;
    }
  });
  return length;
}

const H1PRIME = 4189793;
const H2PRIME = 3296731;
const BIG_PRIME = 5003943032159437;

export function hash(password) {
  let num = password.charCodeAt(0);
  for (let i = 1; i < password.length; i++) {
    num = ((num*256)%BIG_PRIME + password.charCodeAt(i))%BIG_PRIME;
  }
  const hash = ((num % H1PRIME) + 5*(num % H2PRIME) + 1 + 25)%BIG_PRIME;
  return hash;
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
