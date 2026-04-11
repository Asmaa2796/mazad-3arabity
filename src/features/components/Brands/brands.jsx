import style from './brands.module.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay } from "swiper/modules";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../../../Redux/Slices/contentSlice";

const Brands = () => {
    const { language, isArabic, t } = useLanguage();
    const dispatch = useDispatch();
    const brandsState = useSelector((state) => state.content.brands);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(fetchBrands({ lang: language ,search}));
        }, 350);
        return () => clearTimeout(timer);
    }, [dispatch, search, language]);

    const brands = Array.isArray(brandsState.data) ? brandsState.data : [];
    const swiperBreakpoints = {
        320: { slidesPerView: 2 },
        576: { slidesPerView: 3 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 5 },
    };

    return (
        <div className={`${style.brands} py-5 bg-light`}>
            <div className="container">
                <h2 className="text-center dark-color fw-medium mb-4">
                    {t.brands?.title || (isArabic ? "العلامات التجارية" : "Brands")}
                </h2>
                <div className="mb-3">
                    <input
                        className="form-control"
                        placeholder={t.brands?.searchPlaceholder || (isArabic ? "ابحث عن العلامة التجارية" : "Search brands")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {brandsState.status === "loading" ? <div className="text-center py-3">{t.common.loading}</div> : null}
                {brandsState.error ? <div className="alert alert-danger">{brandsState.error}</div> : null}

                <Swiper
                    key={language}
                    dir={isArabic ? "rtl" : "ltr"}
                    className={style.swiper}
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={5}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    pagination={{ clickable: true   }}
                    loop={true}
                    breakpoints={swiperBreakpoints}
                >
                    {brands.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className={`${style.brandCard} bg-white my-3 text-center rounded-3 border shadow-sm`}>
                                <img
                                    src={item.logo}
                                    alt={item.name}
                                    className='d-block'
                                />
                                <div className="small text-secondary ">{item.name}</div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Brands;