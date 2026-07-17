import React, { useEffect, useRef } from 'react';
// import gsap from 'gsap';
import "./css/loader.css";
import { useSelector } from 'react-redux';
import Img from "../../assets/images/loaderimg.png"

const Loader = () => {
  const { isLoading } = useSelector((state) => state.loader);

  // const carRef = useRef(null);
  // const wheelRefs = {
  //   front: useRef(null),
  //   back: useRef(null),
  // };
  // const smoke1 = useRef(null);
  // const smoke2 = useRef(null);
  // const loadingTextRef = useRef(null);

  // useEffect(() => {
  //   if (!isLoading) return;

  //   // Maşın yuxarı-aşağı hərəkəti
  //   gsap.to(carRef.current, {
  //     y: -10,
  //     repeat: -1,
  //     yoyo: true,
  //     duration: 0.5,
  //     ease: 'power1.inOut',
  //   });

  //   // Təkərlər fırlanır
  //   gsap.to([wheelRefs.front.current, wheelRefs.back.current], {
  //     rotate: 360,
  //     transformOrigin: 'center',
  //     repeat: -1,
  //     duration: 1,
  //     ease: 'linear',
  //   });

  //   // Tüstü
  //   const createSmokeAnim = (smokeRef, delay = 0) => {
  //     gsap.fromTo(
  //       smokeRef.current,
  //       {
  //         opacity: 0.6,
  //         y: 0,
  //         scale: 0.5,
  //       },
  //       {
  //         opacity: 0,
  //         y: -60,
  //         scale: 1.2,
  //         repeat: -1,
  //         duration: 2,
  //         delay,
  //         ease: 'power1.out',
  //       }
  //     );
  //   };

  //   createSmokeAnim(smoke1, 0);
  //   createSmokeAnim(smoke2, 1);

  //   // Loading text
  //   gsap.to(loadingTextRef.current, {
  //     scale: 1.1,
  //     opacity: 0.7,
  //     repeat: -1,
  //     yoyo: true,
  //     duration: 1,
  //     ease: 'sine.inOut',
  //   });
  // }, [isLoading]); // yalnız isLoading true olduqda effekt işə düşsün

  if (!isLoading) return null;

  return (
    <div className='loader_container'>
      {/* <svg
        ref={carRef}
        width="400"
        height="200"
        viewBox="0 0 400 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle ref={smoke1} cx="110" cy="160" r="10" fill="#999" opacity="0.6" />
        <circle ref={smoke2} cx="110" cy="160" r="8" fill="#ccc" opacity="0.5" />
        <rect x="70" y="90" width="260" height="60" rx="20" fill="#ff595e" />
        <path d="M100 90 C120 50, 280 50, 300 90 Z" fill="#ffca3a" stroke="#000" strokeWidth="2" />
        <rect x="130" y="60" width="40" height="30" rx="5" fill="#8ecae6" />
        <rect x="190" y="60" width="40" height="30" rx="5" fill="#8ecae6" />
        <circle cx="330" cy="115" r="8" fill="#f1fa8c" />
        <circle ref={wheelRefs.front} cx="120" cy="160" r="20" fill="#333" stroke="#ccc" strokeWidth="4" />
        <circle ref={wheelRefs.back} cx="280" cy="160" r="20" fill="#333" stroke="#ccc" strokeWidth="4" />
      </svg>

      <h2
        ref={loadingTextRef}
        style={{
          marginTop: '30px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          fontSize: '28px',
          letterSpacing: '3px',
        }}
      >
        Loading...
      </h2> */}
      <img src={Img} alt="" />
    </div>
  );
};

export default Loader;
