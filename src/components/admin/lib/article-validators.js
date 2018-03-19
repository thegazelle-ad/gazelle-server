export function checkForHttp(html) {
  if (/http:\/\/.*\..{3,}/.test(html) || /http(?!s)/.test(html)) {
    return false;
  } else if (/https:\/\/.*\..{3,}/.test(html)) {
    return true;
  }
  return false;
}
// original if statement for first function (/http(?!s)/.test(html))
// http(?!s):\/\/\..*\..{3,}
// has a non https link in the body
// we want the function to equal true
// if the function does have an s, the function returns true

export function checkForAbsoluteUrlRegex(html) {
  const absoluteUrlRegex = /<a.*?href\s*?=\s*?["']http(.*?)["'] *?>/;
  if (absoluteUrlRegex.test(html)) {
    return true; // has an absoluteUrlregex
  }
  return false;
}

// second function checks for absoluteUrlregex links within the article
// <a.*?href\s*?=\s*?["'](?!http)(.*?)["'] *?>
