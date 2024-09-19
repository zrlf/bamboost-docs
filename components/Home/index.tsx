import React from 'react';
import { Testimonials } from "@/components/Testimonials";
import Link from "next/link";
import styles from "./Home.module.css";
import HomeContent from "@/components/HomeContent";

const testimonials = [
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
]

const Home = () => {
  return (
    <div className="home-content">
      <div className="content-container">
        <div className="hero">
          <h1 className="headline">Get a grip on your data<br className='sm:block hidden' />with bamboost </h1>
          <p className="subtitle">
            {`Bamboost is a Python library built for datamanagement using the HDF5 file
        format. bamboost stands for a lightweight shelf which will boost your
        efficiency and which will totally break if you load it heavily. Just kidding,
        bamboo can fully carry pandas. 🐼🐼🐼🐼`}
          </p>
          <p className="subtitle lg:flex lg:flex-row lg:gap-6 items-start">
            <Link className={styles.cta} href="/docs/basics/03_getting_started">Get started <span>→</span></Link>
            <Link className={styles.cta} href="/docs">Documentation <span>→</span></Link>
            <Link className={styles.cta} href="/apidocs/manager">API documentation <span>→</span></Link>
          </p>
        </div>

        <HomeContent />

        <div className='h-[1px] w-2/3 mx-auto bg-gray-500 mb-5'></div>
        <h2 className='text-center font-bold text-2xl'>Read what they say</h2>
        <Testimonials testimonials={testimonials} className='mb-10' />
        <div className='h-[1px] w-2/3 mx-auto bg-gray-500 mb-5'></div>

      </div>
    </div>
  )
};

export default Home;
