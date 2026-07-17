import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getSocialList } from '../../../actions/homeAction/homeAction'

const FooterLeft = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSocialList())
    }, [dispatch])

    const { socialList } = useSelector(state => state.home)
    return (
        <div className='footer_left_container'>
            <ul className="footer_list">
                <li><Link to={'/'}>Ana səhifə</Link></li>
                <li><Link to={'/about'}>Haqqımızda</Link></li>
                <li><Link to={'/services'}>Xidmətlərimiz</Link></li>
                <li><Link to={'/products'}>Məhsullar</Link></li>
                <li><Link to={'/contact'}>Bizimlə əlaqə</Link></li>
            </ul>
            <p>Bizi sosial şəbəkələrdən izləyin</p>
            <ul className="footer_social_list">
                {
                    socialList?.map((social, i) => {
                        return (
                            <li key={i}>
                                <Link target='_blank' to={social?.link} dangerouslySetInnerHTML={{ __html: social?.icon }}>
                                   
                                </Link>
                            </li>
                        )
                    })
                }

            </ul>
        </div>
    )
}

export default FooterLeft