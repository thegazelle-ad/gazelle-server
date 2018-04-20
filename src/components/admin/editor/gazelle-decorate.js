import Prism from 'prismjs';
import 'prismjs/components/prism-markdown';

/*
 * Decorates you Slate text with labels that tell
 * the renderer about Markdown.
 */
export function gazelleDecorate(node) {
  if (node.object !== 'block') {
    return [];
  }
  const characters = node.getTexts().toArray();
  const string = node.text;
  const grammar = Prism.languages.markdown;
  const tokens = Prism.tokenize(string, grammar);
  const decoratedText = addMarks(characters, tokens);
  return decoratedText;
}

function getLength(token) {
  if (typeof token === 'string') {
    return token.length;
  } else if (typeof token.content === 'string') {
    return token.content.length;
  }
  return token.content.reduce((l, t) => l + getLength(t), 0);
}

function addMarks(characters, tokens) {
  const decorations = [];
  let startText = characters.shift();
  let endText = startText;
  let startOffset = 0;
  let endOffset = 0;
  let start = 0;
  tokens.forEach(token => {
    startText = endText;
    startOffset = endOffset;

    const length = getLength(token);
    const end = start + length;

    let available = startText.text.length - startOffset;
    let remaining = length;

    endOffset = startOffset + remaining;

    while (available < remaining) {
      endText = characters.shift();
      remaining = length - available;
      available = endText.text.length;
      endOffset = remaining;
    }

    if (typeof token !== 'string') {
      const range = {
        anchorKey: startText.key,
        anchorOffset: startOffset,
        focusKey: endText.key,
        focusOffset: endOffset,
        marks: [{ type: token.type }],
      };

      decorations.push(range);
    }

    start = end;
  });

  return decorations;
}
