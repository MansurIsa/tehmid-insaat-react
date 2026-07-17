import React from 'react'
import "./css/otherBanner.css"

const OtherBanner = ({bannerTitle}) => {
    return (
        <div className='other_banner_container project_container'>
            <h1>{bannerTitle}</h1>
        </div>
    )
}

export default OtherBanner