import React from 'react'
import "./css/about.css"
import MainLayout from '../../layouts/mainLayout/MainLayout'
import AboutBanner from '../../components/banner/aboutBanner/AboutBanner'
import SectionHeader from '../../components/main/sectionHeader/SectionHeader'
import AboutSuperiors from '../../components/main/about/aboutSuperiors/AboutSuperiors'
import AboutCounter from '../../components/main/about/aboutCounter/AboutCounter'
import AboutCooperation from '../../components/main/about/aboutCooperation/AboutCooperation'

const About = () => {
  return (
    <MainLayout>
      <AboutBanner />
      <section className='about_page_section'>
        <SectionHeader sectionHeader="Üstüklüklərimiz" />
        <AboutSuperiors />
      </section>
      <section>
        <SectionHeader sectionHeader="Fəaliyyətimizə bir baxış" />
        <AboutCounter />
      </section>
      <section className='about_page_section_end'>
        <AboutCooperation />
      </section>

    </MainLayout>
  )
}

export default About