import React from 'react';
import clsx from 'clsx';
export default function FooterLayout({ style, links, logo, copyright }) {
  return (
    <footer
      className={clsx('footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container">
        <div>{links}</div>
        {(logo || copyright) && (
          <div className="footer__bottom">
            {logo && <div className="text-center">{logo}</div>}
            <div className='text-center'>{copyright}</div>
          </div>
        )}
      </div>
    </footer>
  );
}
