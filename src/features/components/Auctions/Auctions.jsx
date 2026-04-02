import style from "./Auctions.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { IconCurrencyDollar, IconClock } from "@tabler/icons-react";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";

const Auctions = () => {
    const { language, isArabic } = useLanguage();
    const auctions = [
        {
            id: 1,
            title: "تويوتا كامري 2022",
            desc: "سيارة بحالة ممتازة، عداد قليل، جاهزة للمزايدة",
            images: ["./1.jpg", "./2.jpg"],
            price: "250,000 جنية مصري",
            timeLeft: "ينتهي خلال: 2 يوم 3 ساعات و 15 دقيقة",
        },
        {
            id: 2,
            title: "هيونداي النترا 2023",
            desc: "مواصفات كاملة، فحص كامل، فرصة مميزة",
            images: ["./3.jpg", "./4.jpg"],
            price: "220,000 جنية مصري",
            timeLeft: "ينتهي خلال: 1 يوم 5 ساعات و 40 دقيقة",
        },
        {
            id: 3,
            title: "نيسان التيما 2021",
            desc: "اقتصادية في الوقود، بحالة ممتازة",
            images: ["./5.jpg", "./6.jpg"],
            price: "180,000 جنية مصري",
            timeLeft: "ينتهي خلال: 3 يوم 1 ساعة و 20 دقيقة",
        },
    ];

    return (
        <div className={`${style.auctions} py-5`}>
            <div className="container">
                <h2 className="text-center fw-medium mb-4">أحدث المزادات</h2>

                <div className="row">
                    {auctions.map((a) => (
                        <div className="col-xl-4 col-lg-4 col-md-6 col-12" key={a.id}>
                            <Link to={`/auction-details/${a.id}`} className={`${style.auction_card} my-2 d-block bg-white`}>

                                <div className={style.new_auction}>مزاد جديد</div>
                                <Swiper
                                    key={`${language}-${a.id}`}
                                    dir={isArabic ? "rtl" : "ltr"}
                                    modules={[Autoplay, Pagination]}
                                    loop
                                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                                    pagination={{ clickable: true }}
                                    className={style.card_swiper}
                                >
                                    {a.images.map((img, i) => (
                                        <SwiperSlide key={i}>
                                            <div
                                                className={style.card_img}
                                                style={{ backgroundImage: `url(${img})` }}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                {/* Content */}
                                <div className="p-3 text-end">
                                    <h5 className="fw-medium">{a.title}</h5>
                                    <p className="text-md text-secondary">{a.desc}</p>
                                    <ul className={`${style.auction_info} list-unstyled p-0`}>
                                        <li>
                                            <span className="d-flex align-items-center">
                                                <span className={style.icon_bg}>
                                                    <IconCurrencyDollar size={14} />
                                                </span>
                                               <span className="mx-1"> السعر الحالي:</span>

                                            </span>
                                            <span>{a.price}</span>
                                        </li>
                                        <li>
                                            <span className={style.icon_bg}>
                                                <IconClock size={14} />
                                            </span>
                                            <span className="mx-1">{a.timeLeft}</span>
                                        </li>
                                    </ul>

                                    <button className={`${style.bid_btn} shadow-sm`}>
                                        مزايدة
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Auctions;