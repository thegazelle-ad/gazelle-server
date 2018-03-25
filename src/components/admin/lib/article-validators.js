export function isHttps(html) {
  if (/http:\/\/[\S]+\.[a-zA-Z]{2,}/.test(html) || /http(?!s)/.test(html)) {
    return false;
  } else if (/https:\/\/.*\..{3,}/.test(html)) {
    return true;
  }
  return false;
}
export function returnsURLifAbsolute(html) {
  const relativeUrlRegexLink = /<a.*?href\s*?=\s*?["'](?!http)(.*?)["'] *?>/;
  const relativeURLRegexImage = /<img.*?src\s*?=\s*?["'](?!http)(.*?)["'] .*?>/;
  if (relativeUrlRegexLink.test(html)) {
    const url = html.match(relativeUrlRegexLink)[1];
    return url;
  } else if (relativeURLRegexImage.test(html)) {
    const url = html.match(relativeURLRegexImage)[1];
    return url;
    // console.log()
    // return true;
  }
  return null;
}
// return a url if it finds absolute URL (consts)
// null if not


// define absoluteUrlRegex within function


// if its a link or an image (like href), could be tested with tw regex

// better names

// image <img src="pulpitrock.jpg" alt="Mountain View">
 // /<img.*?src\s*?=\s*?["']http(.*?)["'] *?>/
