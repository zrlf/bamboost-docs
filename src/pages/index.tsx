import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';
import './index.scss';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero text-gray-800 hero-custom flex flex-col justify-center min-h-fit')}>
      <div className="container">
        <Heading as="h1" className="hero__title mb-10">
          {siteConfig.title}
        </Heading>
        <p className="sub-title mb-16">{siteConfig.tagline}</p>
        <div className="buttons">
          <Link className="btn btn-primary" to="/docs/get-started/installation">
            Get Started
          </Link>

          <Link className="btn btn-outline" to="/docs/intro">
            Documentation
          </Link>
          <Link className="btn btn-outline" to="/blog">
            Examples
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={`Welcome to ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
        <div className="container">There is no content here yet.</div>
      </main>
    </Layout>
  );
}
