import { useState, useRef, useEffect } from "react";
import cn from "clsx";
import styles from "./styles.module.css";

export const Testimonials = ({
  testimonials: testimonialsPassed,
  className,
}: {
  testimonials: {
    author: string;
    quote: string;
  }[];
  className?: string;
}) => {
  const [testimonials, setTestimonials] = useState(testimonialsPassed);

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
        testimonialRef.current.style.setProperty(
          "--slide-distance",
          `-${totalWidth / 2}px`
        );
      } else {
        testimonialRef.current.style.setProperty("--slide-distance", `0px`);
        testimonialRef.current.style.setProperty("justify-content", `center`);
      }
    }
  }, [testimonials]);

  return (
    <div
      className={cn(styles.testimonialContainer, className)}
      ref={containerRef}
    >
      <div className={styles.testimonials} ref={testimonialRef}>
        {testimonials.map((testimonial, index) => (
          <div key={`first-${index}`} className={styles.testimonial}>
            <i>{`"${testimonial.quote}"`}</i>
            <div className={styles.author}> - {testimonial.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
