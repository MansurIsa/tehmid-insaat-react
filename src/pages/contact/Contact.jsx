import React, { useEffect } from 'react'
import "./css/contact.css"
import MainLayout from '../../layouts/mainLayout/MainLayout'
import OtherBanner from '../../components/banner/otherBanner/OtherBanner'
import ContactForm from '../../components/main/contact/ContactForm'
import { useDispatch, useSelector } from 'react-redux'
import { getSettingsList } from '../../actions/homeAction/homeAction'

const Contact = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSettingsList())
  }, [dispatch])

  const { settingsList } = useSelector((state) => state.home)

  const address = settingsList[0]?.address

  // API açarsız Google Maps xəritəsi linki
  const mapSrc = address
    ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`
    : ''

  return (
    <MainLayout>
      <OtherBanner bannerTitle="Bizimlə əlaqə" />

      <section>
        <ContactForm />
      </section>

      <div className="map_container">
        {address && (
          <iframe
            src={mapSrc}
            style={{ border: 0, width: '100%', height: '400px' }}
            allowFullScreen
            loading="lazy"
            title="Google Map"
          ></iframe>
        )}
      </div>
    </MainLayout>
  )
}

export default Contact
