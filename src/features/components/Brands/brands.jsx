import style from './brands.module.css';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const Brands = () => {
    const brands = [
        { id: 1, brand: "./b1.png" },
        { id: 2, brand: "./b2.png" },
        { id: 3, brand: "./b3.png" },
        { id: 4, brand: "./b4.png" },
        { id: 5, brand: "./b5.png" },
        { id: 6, brand: "./b6.png" }
    ];

    return (
        <div className={`${style.brands} py-5 bg-light`}>
            <div className="container">
                <h2 className="text-center dark-color fw-medium mb-4">
                   العلامات التجارية
                </h2>

                <Swiper
                    className={style.swiper}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={5}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    loop={true}
                    breakpoints={{
                        320: { slidesPerView: 2 },
                        576: { slidesPerView: 3 },
                        768: { slidesPerView: 3 },
                        992: { slidesPerView: 5 },
                    }}
                >
                    {brands.map((item) => (
                        <SwiperSlide key={item.id}>
                            <div className={`${style.brandCard} bg-white my-3 text-center rounded-3 border shadow-sm`}>
                                <img
                                    src={item.brand}
                                    alt={item.id}
                                    className='d-block'
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default Brands;