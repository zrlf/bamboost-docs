import React, { useRef } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import AuthorHeader from '@theme/BlogPostItem/Header/Author';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';

import DatabaseScreenshot from '@site/static/img/database.png';
import WelcomeScreenshot from '@site/static/img/bamboost-welcome.png';

import styles from './index.module.scss';
import { useEffect, useState } from 'react';

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
      location: '/docs/documentation/get-started/installation',
      text: '🚀 Get Started',
    },
    {
      className: 'btn btn-outline',
      location: '/docs/documentation/get-started',
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

const Introduction = () => {
  return (
    <main className={clsx('container', styles.introduction)}>
      <h2>Goal</h2>
      <p>
        Finding the right data in a large amount of scientific data is hard. By using a database, we
        can query the right data by its parameters or metadata. However, database systems built
        around SQL require setup and maintenance. Often it is also not feasible due to the need of
        having files for visualization <i>e.g.</i> XDMF files.
      </p>

      <p>
        <b style={{ color: 'var(--primary)' }}>bamboost</b> is made for when you want{' '}
        <i>database</i> functionality but want to avoid the overhead of a database system. It is
        providing a file-based database system using HDF5 files for its core functionality. Data is
        stored automatically and the naming is no longer important. Unfortunately, most database
        solutions require significant initial setup and maintenance. The goal is to provide a
        database system with <b>zero overhead</b>.
      </p>

      <Admonition type="info" title="Why bamboost?">
        <ul>
          <li>
            Uses HDF5 to store data, allowing fast and specific access to large amount of data.
          </li>
          <li>Minimizes the number of files.</li>
          <li>Create new databases on the fly. No setup needed.</li>
          <li>Add new entries, create parametric studies, query results easily.</li>
          <li>Workflow manager to generate jobs, specifically on ETH's Euler cluster.</li>
        </ul>
      </Admonition>

      <h2>Basic usage</h2>
      <CodeBlock language="py">
        {`from bamboost import Manager
db = Manager('path/to/database')`}
      </CodeBlock>

      <p>Create a new entry in the database:</p>
      <CodeBlock language="py">
        {`new_entry = db.create_simulation(
    parameters: dict = {...},
)`}
      </CodeBlock>

      <p>Display the content in the database:</p>
      <CodeBlock language="py">{`db.df  # Returns a pandas DataFrame`}</CodeBlock>

      <p>Select a specific entry:</p>
      <CodeBlock language="py">{`db['simulation_1']  # Returns a Simulation object`}</CodeBlock>

      <p>Or leverage pandas to query the database:</p>
      <CodeBlock language="py">
        {`db.df[(db.df['param_1'] == 1.0) && (db.df['param_2'] > 2.0)]`}
      </CodeBlock>

      <h2>Concept</h2>
      <p>
        The fundamental unit in this framework is a database, serving as a container for organized
        data, containing simulations. Conceptually, a database is a directory housing subdirectories
        for individual simulations. Within each simulation directory, a primary HDF5 file is
        present, storing all metadata and data. Additionally, users have the flexibility to store
        supplementary files within the simulation directory.
      </p>

      <pre>
        {`Database_A
|-- Simulation_1
|   |-- simulation_1.h5
|   |-- additional_file_1.txt
|   |-- additional_file_2.csv
|-- Simulation_2
|   |-- simulation_2.h5
|   |-- additional_file_3.txt`}
      </pre>

      <p>
        The goal is to maintain comparability within a single database, implying similarity in the
        nature of the data. For instance, you might have a database for simulations of a parametric
        study or a database for simulations of a specific system with varying initial conditions.
      </p>
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
