import React from 'react'
import "./css/home.css"
import MainLayout from '../../layouts/mainLayout/MainLayout'
import HomeBanner from '../../components/banner/homeBanner/HomeBanner'
import HomeFirstSection from '../../components/main/homeFirstSection/HomeFirstSection'
import SectionHeader from '../../components/main/sectionHeader/SectionHeader'
import HomeSecondSection from '../../components/main/homeSecondSection/HomeSecondSection'
import ContactForm from '../../components/main/contact/ContactForm'


const Home = () => {
  return (
    <MainLayout>
      <HomeBanner/>
      <section>
        <HomeFirstSection/>
      </section>
      <section>
        <SectionHeader sectionHeader="Məhsul kateqoriyalarımız"/>
        <HomeSecondSection/>
      </section>
      <section className='contact_section'>
        <SectionHeader sectionHeader="Müraciət formu"/>
        <ContactForm/>
      </section>
      
    </MainLayout>
  )
}

export default Home