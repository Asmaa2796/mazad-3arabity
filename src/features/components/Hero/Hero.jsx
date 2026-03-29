import style from "./hero.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const slides = [
    {
      id: 1,
      sup: "عروض",
      title: "مزادات تتجدّد يوميًا",
      titleColor: "main-color",
      image: "./slide1.png",
      linkBg: "main-bg",
      linkColor: "main-color",
      borderColor: "border-main",
    },
    {
      id: 2,
      sup: "اكتشف",
      title: "أفضل الصفقات قبل ما تفوتك",
      titleColor: "text-secondary",
      image: "./slide2.png",
      linkBg: "bg-secondary",
      linkColor: "text-secondary",
      borderColor: "border-secondary",
    },
    {
      id: 3,
      sup: "ابدأ",
      title: "مزايدتك وامتلك عربيتك بثقة",
      titleColor: "text-danger",
      image: "./slide3.png",
      linkBg: "bg-danger",
      linkColor: "text-danger",
      borderColor: "border-danger",
    }
  ];

  return (
    <div className={`${style.hero_section}`}>
      <div className="container">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          loop={true}
          speed={1500}
          navigation={{
            nextEl: ".next",
            prevEl: ".prev",
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
                    <h1 className="text-dark">{slide.sup}</h1>
                    <h1 className={slide.titleColor}>{slide.title}</h1>
                  </div>
                  <div className="d-flex">
                    <Link className={`${style.hero_link} ${slide.linkBg}`}>
                      مشاهدة المزيد <IconChevronLeft size={17} />
                    </Link>
                    <Link className={`${style.hero_link_transparent} ${slide.borderColor} ${slide.linkColor}`}>
                      اعرض عربيتك <IconChevronLeft size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* navigation buttons */}
          <div className={`prev ${style.prev} ${style.nav_btn}`}>
            <IconChevronLeft size={17} />
          </div>
          <div className={`next ${style.next} ${style.nav_btn}`}>
            <IconChevronRight size={17} />
          </div>
        </Swiper>
      </div>
    </div>
  );
};

export default Hero;