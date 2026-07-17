import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import "./toTop.css"

const ToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {visible && (
        <button
          onClick={goTop}
          className="toTopBtn"
        >
          <FaArrowUp size={20} color="#fff" />
        </button>
      )}
    </>
  );
};

export default ToTop;
