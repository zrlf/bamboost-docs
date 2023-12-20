import { basePath } from './index';
import path from 'path-browserify';
import Link from '@docusaurus/Link';

export const parseString = (str: string) => {
  if (str === null) return null;

  const linkRegex = /(:(?:class|func):~?`[^`]+`)/g;
  const typeRegex = /:(\w*):`~?([^`]+)`/g;
  const parts = str.split(linkRegex);

  const elements = parts.map((part, index) => {
    if (index % 2 === 0) {
      return part;
    } else {
      const [match, type, linkText] = typeRegex.exec(part);
      const pathRaw = path.join(basePath, part.replace(/~/g, ''));
      let modulePath: string;
      if (type === 'class') {
        modulePath = path.join(basePath, pathRaw.split('.').slice(1, -1).join('/'));
      } else if (type === 'func') {
        modulePath = path.join(basePath, pathRaw.split('.').slice(1, -2).join('/'));
      } else {
        modulePath = path.join(basePath, pathRaw.split('.').slice(1).join('/'));
      }
      const linkPath = `${modulePath}#${linkText.split('.').pop().toLowerCase()}`;

      return (
        <Link to={linkPath}>
          <code>{linkText}</code>
        </Link>
      );
    }
  });

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

  return (
    <Link to={linkPath}>
      {linkText}
    </Link>
  );
};


export const parseVariable = (str: string) => {};
