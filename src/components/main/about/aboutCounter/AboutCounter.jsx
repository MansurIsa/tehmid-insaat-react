import React, { useEffect } from "react";
import AboutCounterCard from "./AboutCounterCard";
import "../css/about.css";
import { useDispatch, useSelector } from "react-redux";
import { getActivityList } from "../../../../actions/aboutAction/aboutAction";

const AboutCounter = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getActivityList());
  }, [dispatch]);

  const { activityList } = useSelector((state) => state.about);

  return (
    <div className="about_counter_container">
      {activityList?.map((data, i) => (
        <AboutCounterCard key={i} data={data} />
      ))}
    </div>
  );
};

export default AboutCounter;
