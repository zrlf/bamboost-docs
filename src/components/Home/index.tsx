import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import AuthorHeader from '@theme/BlogPostItem/Header/Author';

import styles from './index.module.scss';
import '@site/src/pages/index.scss';
import { useEffect, useState } from 'react';
import { useLocation } from '@docusaurus/router';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero-custom')}>
      <div className="container">
        <Heading as="h1" className="hero__title mb-10">
          {siteConfig.title}
        </Heading>
        <p className="sub-title mb-16">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="btn btn-primary" to="/docs/documentation/get-started/installation">
            Get Started
          </Link>

          <Link className="btn btn-outline" to="/docs/documentation/get-started">
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
  );
}

function RecentBlogPostCard({ recentPost }) {
  const { Preview, metadata } = recentPost;
  return (
    <article className={styles.blogPost}>
      <Link to={`news/${metadata.frontMatter.slug}`}>
        <h2>{metadata.title}</h2>
      </Link>
      <p>{metadata.description}</p>
      <AuthorHeader author={metadata.authors[0]} />
      <hr />
      <Preview />
    </article>
  );
}

const BlogBlock = ({ homePageBlogMetadata, recentPosts }) => {
  return (
    <main className={clsx('container', styles.blogContainer)}>
      <h1>News</h1>

      <section className={styles.blog}>
        {recentPosts.map((recentPost, index) => (
          <RecentBlogPostCard key={index} recentPost={recentPost} />
        ))}
      </section>
    </main>
  );
};

export default function Home({ homePageBlogMetadata, recentPosts }) {
  const { siteConfig } = useDocusaurusContext();
  return (
    <div className={styles.page}>
      <Layout
        title={`Welcome to ${siteConfig.title}`}
        description="Documentation site for the bamboost project">
        <HomepageHeader />
        <BlogBlock homePageBlogMetadata={homePageBlogMetadata} recentPosts={recentPosts} />
      </Layout>
    </div>
  );
}
