import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSettingsList } from '../../../actions/homeAction/homeAction'

const FooterRight = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSettingsList())
  }, [dispatch])

  const { settingsList } = useSelector(state => state.home)

  const address = settingsList[0]?.address
  const contactNumber = settingsList[0]?.contact_number

  return (
    <div className='footer_right_container'>
      <div>
        <p>Adres</p>
        {address && (
          <a 
            href={`https://www.google.com/maps/search/?q=${encodeURIComponent(address)}`} 
            target='_blank' 
            rel='noopener noreferrer'
          >
            {address}
          </a>
        )}
      </div>
      <div>
        <p>Əlaqə nömrəsi</p>
        {contactNumber && (
          <a href={`tel:${contactNumber}`}>
            {contactNumber}
          </a>
        )}
        <a href="tel:+994504020250">
            {/* +994 50 402 02 50 */}
          </a>
          <a href="tel:+994504800420">
            {/* +994 50 480 04 20 */}
          </a>
      </div>
    </div>
  )
}

export default FooterRight
