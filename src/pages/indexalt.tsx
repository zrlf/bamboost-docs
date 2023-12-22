import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import './index.scss';
import { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

const LightBulb = require('@site/static/img/welcome-background.svg').default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className="hero-container">
      <div className="hero-background"></div>
      <header
        className={clsx('hero hero-custom text-gray-800 flex flex-col justify-center min-h-fit')}>
        <div className="container">
          <Heading as="h1" className="hero__title mb-10">
            {siteConfig.title}
          </Heading>
          <p className="sub-title mb-16">{siteConfig.tagline}</p>
          <div className="buttons">
            <Link className="btn btn-primary" to="/docs/documentation/get-started/installation">
              Get Started
            </Link>

            <Link className="btn btn-outline" to="/docs/documentation/intro">
              Documentation
            </Link>
            <Link className="btn btn-outline" to="/docs/autoDocs/manager">
              Reference Guide
            </Link>
            <Link className="btn btn-outline" to="/blog">
              Updates
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default function Home({homePageBlogMetadata, recentPosts}): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [scrollPosition, setScrollPosition] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const opacity = Math.min(1, scrollPosition / 200);
  useEffect(() => {
    
    const navbar = document.querySelector('.navbar') as HTMLElement | null;
    if (navbar===null) return;
    const darkMode = document.scrollingElement?.dataset.theme === 'dark';
    navbar.style.boxShadow = 'none';
    if (darkMode) {
      navbar.style.backgroundColor = `rgba(31, 29, 46, ${opacity})`;
      navbar.style.backgroundImage = 'none';
    } else {
      navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    }
  }, [scrollPosition]);

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <BlogPeak {...{homePageBlogMetadata, recentPosts}} /> */}
      </main>
    </Layout>
  );
}
