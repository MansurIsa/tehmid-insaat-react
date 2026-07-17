import React, { useEffect } from 'react'
import AboutSuperiorsCard from './AboutSuperiorsCard'
import "../css/about.css";
import { useDispatch, useSelector } from 'react-redux';
import { getAdvantageList } from '../../../../actions/aboutAction/aboutAction';

const AboutSuperiors = () => {
  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(getAdvantageList())
  },[dispatch])

  const {advantageList}=useSelector(state=>state.about)
  return (
    <div className='about_superiors_container project_container'>
      {
        advantageList?.map((data,i)=>{
          return  <AboutSuperiorsCard key={i} data={data}/>
        })
      }
        {/* <AboutSuperiorsCard/>
        <AboutSuperiorsCard/>
        <AboutSuperiorsCard/> */}
    </div>
  )
}

export default AboutSuperiors