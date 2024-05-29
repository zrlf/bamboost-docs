import { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import styles from './styles.module.scss';
import { TOC } from '@theme/TOC';

const getNestedHeadings = (headingElements) => {
  const nestedHeadings = [];

  headingElements.forEach((heading, index) => {
    const { innerText: title, id } = heading;

    if (heading.nodeName === 'H2') {
      nestedHeadings.push({ id, title, items: [] });
    } else if (heading.nodeName === 'H3' && nestedHeadings.length > 0) {
      nestedHeadings[nestedHeadings.length - 1].items.push({
        id,
        title,
      });
    }
  });

  return nestedHeadings;
};

const useHeadingsData = () => {
  const [nestedHeadings, setNestedHeadings] = useState([]);

  useEffect(() => {
    const headingElements = Array.from(document.querySelectorAll('h2, h3'));

    const newNestedHeadings = getNestedHeadings(headingElements);
    setNestedHeadings(newNestedHeadings);
  }, []);

  return { nestedHeadings };
};

const Headings = ({ headings, activeId }) => (
  <div>
    <ul
      style={{
        fontSize: 'var(--font-small)',
        textTransform: 'uppercase',
        color: 'var(--text-opaque)',
        margin: '0',
      }}>
      On this page
    </ul>
    <ul className={styles.customToc}>
      {headings.map((heading) => (
        <li key={heading.id} className={heading.id === activeId ? styles.active : ''}>
          {' '}
          <a href={`#${heading.id}`}>{heading.title}</a>
          {heading.items.length > 0 && (
            <ul>
              {heading.items.map((child) => (
                <li key={child.id} className={child.id === activeId ? styles.active : ''}>
                  {' '}
                  <a href={`#${child.id}`}>{child.title}</a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const useIntersectionObserver = (setActiveId) => {
  const headingElementsRef = useRef({});
  useEffect(() => {
    const callback = (headings) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement;
        return map;
      }, headingElementsRef.current);

      const visibleHeadings = [];
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key];
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement);
      });

      const getIndexFromId = (id) => headingElements.findIndex((heading) => heading.id === id);

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(a.target.id) > getIndexFromId(b.target.id)
        );
        setActiveId(sortedVisibleHeadings[0].target.id);
      }
    };
    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -40% 0px',
    });

    const headingElements = Array.from(document.querySelectorAll('h2, h3'));

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [setActiveId]);
};

export const TableOfContents = () => {
  const [activeId, setActiveId] = useState();
  const { nestedHeadings } = useHeadingsData();
  const [root, setRoot] = useState(null);

  useIntersectionObserver(setActiveId);

  useEffect(() => {
    const toc = document.querySelector('.table-of-contents');
    if (toc && !root) {  // toc already exists
      setRoot(createRoot(toc));
    } else if (!toc) {  // toc does not exist, create it and inject it into the DOM
      const container = document.querySelector('.container .row');
      const newToc = document.createElement('div');
      newToc.classList.add('col', 'col--3');

      const innerDiv = document.createElement('div');
      innerDiv.classList.add(
        'table-of-contents',
        'thin-scrollbar',
        styles.tableOfContents,
        styles.docItemContainer,
        'table-of-contents__left-border'
      );
      newToc.appendChild(innerDiv);

      container.appendChild(newToc);
      setRoot(createRoot(innerDiv));
    }
    if (toc && root) {
      setTimeout(() => {
        flushSync(() => {
          root.render(<Headings headings={nestedHeadings} activeId={activeId} />);
        });
      }, 0);
    }
  }, [nestedHeadings, activeId]);

  return null;
};

export const RenderTOC = () => {
  const [activeId, setActiveId] = useState();
  const { nestedHeadings } = useHeadingsData();

  useIntersectionObserver(setActiveId);

  return (
    <div className={styles.customTocDiv}>
      <Headings headings={nestedHeadings} activeId={activeId} />
    </div>
  );
};
