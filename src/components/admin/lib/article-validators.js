export function hasNonHttpsURL(html) {
  // if (/http:\/\/[\S]+\.[a-zA-Z]{2,}/.test(html) || /http(?!s)/.test(html)) {
  if (/<a.*?href\s*?=\s*?["'](http(?!s))(.*?)["'] *?>/.test(html)) {
    return true;
  } else if (/<img.*?src\s*?=\s*?["'](http)(?!s)(.*?)["'] .*?>/.test(html)) {
    return true;
  }
  return false;
}
export function returnsFirstRelativeURL(html) {
  const relativeUrlRegexLink = /<a.*?href\s*?=\s*?["'](?!http)(.*?)["'] *?>/;
  const relativeURLRegexImage = /<img.*?src\s*?=\s*?["'](?!http)(.*?)["'] .*?>/;
  if (relativeUrlRegexLink.test(html)) {
    const url = html.match(relativeUrlRegexLink)[1];
    return url;
  } else if (relativeURLRegexImage.test(html)) {
    const url = html.match(relativeURLRegexImage)[1];
    return url;
  }
  return null;
}
