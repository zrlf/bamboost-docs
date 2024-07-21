import React, { useRef } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import AuthorHeader from '@theme/BlogPostItem/Header/Author';

import DatabaseScreenshot from '@site/static/img/database.png';
import WelcomeScreenshot from '@site/static/img/bamboost-welcome.png';

import styles from './index.module.scss';
import { useEffect, useState } from 'react';
import { Introduction } from './Introduction';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [width, setWidth] = useState(null);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };
  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  });

  const isMobile = width < 996;

  const items = [
    {
      className: 'btn btn-primary',
      location: '/docs/documentation/basics/getting_started',
      text: '🚀 Get Started',
    },
    {
      className: 'btn btn-outline',
      location: '/docs/documentation/basics',
      text: '📖 Documentation',
    },
    {
      className: 'btn btn-outline',
      location: '/docs/autoDocs/manager',
      text: '👩🏽‍💻 Reference Guide',
    },
    {
      className: 'btn btn-outline',
      location: '/news',
      text: '🗞️ Updates',
    },
  ];

  return (
    <header className={clsx(styles.hero)}>
      <div className="container">
        <Heading as="h1" className={styles.title}>
          {/* {siteConfig.title} */}
          {/* Make your data easy. */}
          Get a grip on your data.
        </Heading>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <div className={clsx(styles.buttons)}>
          {items.map((item, index) => (
            <Link key={index} className={item.className} to={item.location}>
              {item.text}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.screenshot}>
        <div className={styles.database}>
          <img src={DatabaseScreenshot}></img>
        </div>
        <div className={styles.welcome}>
          <img src={WelcomeScreenshot}></img>
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

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([
    {
      author: 'Miguel Castellano Merino',
      quote: 'bamboost changed my life. Honestly man.',
    },
    {
      author: 'Raul Lazo Molina',
      quote: "It's really good. I am satisfied with the service.",
    },
    {
      author: 'Prof. David S. Kammer',
      quote: "I don't know what I would do without bamboost. I use it everyday.",
    },
    {
      author: 'Anonymus',
      quote: "Doesn't work.",
    },
    {
      author: 'Luca Michel',
      quote:
        'simulations without bamboost are like a bike without gears. It also work but you’ll suffer more.',
    },
    {
      author: 'Mohit Pundir',
      quote: "It's like having your own butler for data management.",
    },
    {
      author: 'Ale',
      quote: 'I complain all the time. But also on bamboost.',
    },
  ]);

  const testimonialRef = useRef(null);
  const containerRef = useRef(null);

  // Duplicate if too wide
  useEffect(() => {
    if (testimonialRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const totalWidth = testimonialRef.current.scrollWidth;
      if (containerWidth < totalWidth) {
        setTestimonials([...testimonials, ...testimonials]);
      }
    }
  }, []);

  // Set the distance to slide
  useEffect(() => {
    if (testimonialRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const totalWidth = testimonialRef.current.scrollWidth;
      if (containerWidth < totalWidth) {
        testimonialRef.current.style.setProperty('--slide-distance', `-${totalWidth / 2}px`);
      } else {
        testimonialRef.current.style.setProperty('--slide-distance', `0px`);
        testimonialRef.current.style.setProperty('justify-content', `center`);
      }
    }
  }, [testimonials]);

  return (
    <div className={clsx('container', styles.testimonialContainer)} ref={containerRef}>
      <h2>Read what they say</h2>
      <div className={styles.testimonials} ref={testimonialRef}>
        {testimonials.map((testimonial, index) => (
          <div key={`first-${index}`} className={styles.testimonial}>
            <i>"{testimonial.quote}"</i>
            <div className={styles.author}> - {testimonial.author}</div>
          </div>
        ))}
      </div>
    </div>
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
        <Testimonials />
        <Introduction />
        <BlogBlock homePageBlogMetadata={homePageBlogMetadata} recentPosts={recentPosts} />
      </Layout>
    </div>
  );
}
