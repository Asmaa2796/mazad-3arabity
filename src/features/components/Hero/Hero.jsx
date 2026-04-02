import style from "./hero.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchBanners } from "../../../Redux/Slices/contentSlice";

const Hero = () => {
  const { language, isArabic } = useLanguage();
  const dispatch = useDispatch();
  const bannersState = useSelector((state) => state.content.banners);
  const prevClass = `hero-prev-${language}`;
  const nextClass = `hero-next-${language}`;

  useEffect(() => {
    if (bannersState.status === "idle" || bannersState.language !== language) {
      dispatch(fetchBanners());
    }
  }, [dispatch, bannersState.status, bannersState.language, language]);

  const slides =
    Array.isArray(bannersState.data) && bannersState.data.length > 0
      ? bannersState.data.map((banner, index) => ({
          id: banner.id || index + 1,
          title: banner.title || "",
          description: banner.description || " ",
          titleColor: "main-color",
          image: banner.image,
          linkBg: "main-bg",
          linkColor: "main-color",
          borderColor: "border-main",
        }))
      : [];

  return (
    <div className={`${style.hero_section}`}>
      <div className="container">
        {bannersState.status === "loading" ? (
          <div className="text-center py-5">Loading...</div>
        ) : null}
        {bannersState.error ? (
          <div className="alert alert-danger my-3">{bannersState.error}</div>
        ) : null}
        {slides.length === 0 ? null : (
        <Swiper
          key={language}
          dir={isArabic ? "rtl" : "ltr"}
          modules={[Autoplay, Navigation, Pagination]}
          loop={true}
          speed={1500}
          navigation={{
            nextEl: `.${nextClass}`,
            prevEl: `.${prevClass}`,
          }}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className={style.slide}
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className={style.content}>
                  <div className="mb-5">
                    {slide.title ? <h1 className={slide.titleColor}>{slide.title}</h1> : null}
                    {slide.description ? <p className="text-dark">{slide.description}</p> : null}
                  </div>
                  <div className="d-flex pt-5 mt-5">
                    <Link className={`${style.hero_link} ${slide.linkBg} mt-5`}>
                      {isArabic ? "مشاهدة المزيد" : "View More"} <IconChevronLeft size={17} />
                    </Link>
                    <Link className={`${style.hero_link_transparent} ${slide.borderColor} ${slide.linkColor} mt-5`}>
                      {isArabic ? "اعرض عربيتك" : "List Your Car"} <IconChevronLeft size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* navigation buttons */}
          <div className={`${prevClass} ${style.prev} ${style.nav_btn}`}>
            <IconChevronLeft size={17} />
          </div>
          <div className={`${nextClass} ${style.next} ${style.nav_btn}`}>
            <IconChevronRight size={17} />
          </div>
        </Swiper>
        )}
      </div>
    </div>
  );
};

export default Hero;