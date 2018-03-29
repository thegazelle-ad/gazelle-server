import React from 'react';

// this currently only supports parsing links
export function parseMarkdown(str) {
  if (!str) return str;
  // parse links
  const exp = /\[(.*?)\]\((.*?)\)/g;
  const output = [];
  let end = 0;
  for (let result = exp.exec(str); result; result = exp.exec(str)) {
    // eslint-disable-line no-cond-assign
    output.push(str.substring(end, result.index));
    output.push(
      <a href={result[2]} key={`${result[1]}-${result[2]}`}>
        {result[1]}
      </a>,
    );
    end = exp.lastIndex;
  }
  output.push(str.substring(end));
  return output;
}
