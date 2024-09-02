import { basePath } from './index';
import path from 'path-browserify';
import Link from '@docusaurus/Link';

export const parseString = (str: string) => {
  if (!str) return null;

  const lines = str.split('\n');

  const elements = [];
  let currentParagraph = [];
  let currentListItems = [];

  const parseInlineCode = (text: string) => {
    const codeRegex = /`([^`]+)`/g;
    const parts = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = codeRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(<code key={match.index}>{match[1]}</code>);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine === '') {
      // When we encounter an empty line, close the current paragraph and any list
      if (currentParagraph.length > 0) {
        elements.push(<p key={`para-${index}`}>{currentParagraph}</p>);
        currentParagraph = [];
      }
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} style={{ marginBottom: '1em' }}>
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    } else if (trimmedLine.startsWith('-')) {
      // If it's a list item, push it to the current list items array
      if (currentParagraph.length > 0) {
        elements.push(<p key={`para-${index}`}>{currentParagraph}</p>);
        currentParagraph = [];
      }
      currentListItems.push(
        <li key={index}>{parseInlineCode(trimmedLine.substring(2).trim())}</li>
      );
    } else {
      // If it's a regular line, add it to the current paragraph
      currentParagraph.push(...parseInlineCode(trimmedLine));
    }
  });

  // Handle any remaining paragraph or list after the loop
  if (currentParagraph.length > 0) {
    elements.push(<p key="para-end">{currentParagraph}</p>);
  }
  if (currentListItems.length > 0) {
    elements.push(<ul key="list-end">{currentListItems}</ul>);
  }

  return <>{elements}</>;
};

export const parseAnnotation = (str: string) => {
  if (str === null) return null;

  const typeRegex = /<\w*\s.?(bamboost.*[^('|>)]).*/g;
  const typeRegex2 = /:\s?(bamboost\.[^\s>]*)\s?/g;

  const [match, linkText] = typeRegex.exec(str) || typeRegex2.exec(str) || [null, null];
  if (match === null) return str;
  const modulePath = path.join(basePath, linkText.split('.').slice(1, -1).join('/'));
  const linkPath = `${modulePath}#${linkText.split('.').pop().toLowerCase()}`;

  return <Link to={linkPath}>{linkText}</Link>;
};

export const parseVariable = (str: string) => {};
