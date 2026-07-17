import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css/effect-fade";
import "../css/banner.css";
import Img1 from "../../../assets/images/banner1.jpg"
import Img2 from "../../../assets/images/banner2.jpg"
import Img3 from "../../../assets/images/banner3.jpg"
import Img4 from "../../../assets/images/banner4.jpg"
import Img5 from "../../../assets/images/banner5.jpg"
import Img6 from "../../../assets/images/banner.png"
import { useEffect } from "react";
import { getBannerList, getSettingsList } from "../../../actions/homeAction/homeAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";



const HomeBanner = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getBannerList())
        dispatch(getSettingsList())
    }, [dispatch])

    const { bannerList, settingsList } = useSelector(state => state.home)
    const navigate = useNavigate()

    const targetPr = () => {
        navigate("/products")
    }
    return (
        <div>
            <Swiper
                spaceBetween={30}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                modules={[Pagination, Navigation, Autoplay, EffectFade]}
                className="mySwiper"
            >
                {bannerList?.map((banner, i) => (
                    <SwiperSlide className="home_banner_bg_img" data-hash="slide1" key={i} style={{background: `url(${banner?.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
                        <div className="home_banner_yellow">
                            <h1>{banner?.title}</h1>
                            <p>{banner?.content}</p>
                            <button onClick={targetPr}>Məhsullara bax</button>
                        </div>
                    </SwiperSlide>
                ))}
             
            </Swiper>
        </div>
    )
}

export default HomeBanner