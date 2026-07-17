import React, { useEffect, useRef, useState } from "react";

const AboutCounterCard = ({ data }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const end = parseInt(data?.value || 0);
      if (start === end) return;

      const duration = 2000; // 2 saniyə
      const incrementTime = 20; // 0.02 saniyə interval
      const step = Math.ceil((end - start) / (duration / incrementTime));

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          clearInterval(timer);
          start = end;
        }
        setCount(start);
      }, incrementTime);
    }
  }, [isVisible, data]);

  return (
    <div ref={ref} className="about_counter_card">
      <span>{count}+</span>
      <p>{data?.name}</p>
    </div>
  );
};

export default AboutCounterCard;
