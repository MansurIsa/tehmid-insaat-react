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
import Img7 from "../../../assets/images/banner6.png"
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
                {/* {bannerList?.map((banner, i) => (
                    <SwiperSlide className="home_banner_bg_img" data-hash="slide1" key={i} style={{background: `url(${banner?.image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
                        <div className="home_banner_yellow">
                            <h1>{banner?.title}</h1>
                            <p>{banner?.content}</p>
                            <button onClick={targetPr}>Məhsullara bax</button>
                        </div>
                    </SwiperSlide>
                ))} */}
                <SwiperSlide className="home_banner_bg_img home_banner_bg_img1" data-hash="slide1" style={{ background: `url(${Img7})`, backgroundSize: "cover", backgroundPosition: "left", backgroundRepeat: "no-repeat" }}>
                    <div className="home_banner_yellow1">
                        <img src={settingsList[0]?.logo} alt="" />
                        <h1>Tikintinizin Möhkəm Təməli Buradan Başlayır</h1>
                        <p>Yüksək keyfiyyətli tikinti materialları, sürətli çatdırılma və peşəkar xidmətlə hər zaman yanınızdayıq.</p>
                        {/* <button onClick={targetPr}>Məhsullara bax</button> */}
                    </div>
                </SwiperSlide>

                {/* <SwiperSlide className="home_banner_bg_img" data-hash="slide2" style={{ background: `url(${Img3})`, backgroundSize: "cover", backgroundPosition: "right", backgroundRepeat: "no-repeat" }}>
                    <div className="home_banner_yellow3">
                        <h1>Keyfiyyətli Hissələr, Daha Güclü Maşın</h1>
                        <p>WeOneGroup ilə avtomobilinizin performansını artıran düzgün hissələri asanlıqla tapın.</p>
                        <button onClick={targetPr}>Məhsullara bax</button>
                    </div>
                </SwiperSlide>
                <SwiperSlide className="home_banner_bg_img" data-hash="slide3" style={{ background: `url(${Img5})`, backgroundSize: "cover", backgroundPosition: "right", backgroundRepeat: "no-repeat" }}>
                    <div className="home_banner_yellow3">
                        <h1>Avtomobilinizə Dəyər Qatan Seçim</h1>
                        <p>Etibarlı, uzunömürlü və orijinal ehtiyat hissələri ilə sürüş təcrübənizi bir başqa səviyyəyə qaldırın. WeOneGroup-un geniş məhsul çeşidi ilə ehtiyacınız olan hər şeyi tək ünvanda tapın.</p>
                        <button onClick={targetPr}>Məhsullara bax</button>
                    </div>
                </SwiperSlide>
                <SwiperSlide className="home_banner_bg_img home_banner_bg_img2" data-hash="slide4" style={{ background: `url(${Img6})`, backgroundSize: "cover", backgroundPosition: "right", backgroundRepeat: "no-repeat" }}>
                   
                </SwiperSlide> */}
             
            </Swiper>
        </div>
    )
}

export default HomeBanner