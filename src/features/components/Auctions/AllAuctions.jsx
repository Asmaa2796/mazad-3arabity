import style from "./Auctions.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { IconCurrencyDollar, IconClock, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import "swiper/css";
import "swiper/css/pagination";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { fetchAuctions } from "../../../Redux/Slices/auctionsSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
const placeholder = "/car_placeholder.jpg";
const AllAuctions = () => {
    const { language, isArabic, t } = useLanguage();
    const dispatch = useDispatch();
    const auctionsState = useSelector((state) => state.auctions.auctions);
    const { data, language: dataLanguage, pagination } = auctionsState;

    const [page, setPage] = useState(1);

    useEffect(() => {
        dispatch(fetchAuctions({ type: 'all', page }));
    }, [dispatch, page]);

    useEffect(() => {
        setPage(1);
    }, [dataLanguage, language]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [page]);

    return (
        <div className={`${style.auctions} py-5`}>
            <div className="container">
                <h2 className="text-center fw-medium mb-4">{t.auctions.all}</h2>
                {auctionsState.status === "loading" ? (
                    <div className="text-center py-5">{t.common.loading}</div>
                ) : auctionsState.error ? (
                    <div className="alert alert-danger my-3">
                        {auctionsState.error}
                    </div>
                ) : (<>
                    <div className="row">
                        {(data || []).map((auction, index) => (
                            <div className="col-xl-4 col-lg-4 col-md-6 col-12" key={auction?.id || index}>
                                <a href={`/auction-details/${auction.id}`} className={`${style.auction_card} my-2 d-block bg-white`}>
                                    <Swiper
                                        key={`${language}-${auction.id}`}
                                        dir={isArabic ? "rtl" : "ltr"}
                                        modules={[Autoplay, Pagination]}
                                        loop
                                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                                        pagination={{ clickable: true }}
                                        className={style.card_swiper}
                                    >
                                        {(auction.gallery?.length ? auction.gallery : [placeholder]).map((img, i) => (
                                            <SwiperSlide key={i}>
                                                <div
                                                    className={style.card_img}
                                                    style={{ backgroundImage: `url(${img})` }}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                    <div className="p-3">
                                        <h5 className="fw-medium">{auction?.brand?.name} - {auction?.model}</h5>
                                        <p className="text-md text-secondary">{auction?.description?.slice(0, 80)}...</p>
                                        <ul className={`${style.auction_info} list-unstyled p-0`}>
                                            <li>
                                                <span className="d-flex align-items-center">
                                                    <span className={style.icon_bg}>
                                                        <IconCurrencyDollar size={14} />
                                                    </span>
                                                    <span className="mx-1"> {t.auctions.currentPrice}:</span>
                                                </span>
                                                <span>{auction?.highest_bid} {t.auctions.pounds}</span>
                                            </li>
                                            <li>
                                                <span className={style.icon_bg}>
                                                    <IconClock size={14} />
                                                </span>
                                                <span className="mx-1">
                                                    {t.auctions.timeLeft} :
                                                </span>
                                                {auction?.status === "active" ? (
                                                    <>
                                                        <span className="mx-1">
                                                            {auction?.remaining_time?.days || "0"} {t.auctions.days}
                                                        </span>
                                                        <span className="mx-1">
                                                            {auction?.remaining_time?.hours || "0"} {t.auctions.hours}
                                                        </span>
                                                        <span className="mx-1">
                                                            {auction?.remaining_time?.minutes || "0"} {t.auctions.minutes}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="mx-1">
                                                            0 {t.auctions.days}
                                                        </span>
                                                        <span className="mx-1">
                                                            0 {t.auctions.hours}
                                                        </span>
                                                        <span className="mx-1">
                                                            0 {t.auctions.minutes}
                                                        </span>
                                                    </>
                                                )}
                                            </li>
                                        </ul>
                                        {auction?.status === "sold" ? (
                                            <button className={style.sold} disabled>{t.auctions.sold}</button>
                                        ) : auction?.remaining_time === null ? (
                                            <button className={style.sold} disabled>{t.auctions.auction_ended}</button>
                                        ) : (
                                            <button className={`${style.bid_btn} shadow-sm`}>
                                                {t.auctions.bidding}
                                            </button>
                                        )}
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                    {pagination?.last_page > 1 && (
                        <div className={`${style.pagination} d-flex justify-content-center align-items-center gap-2 mt-4`}>
                            <button
                                className={style.page_btn}
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                {isArabic ? <IconChevronRight size={17} /> : <IconChevronLeft size={17} />}
                            </button>
                            {Array.from({ length: pagination?.last_page || 0 }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`${style.page_number} ${page === i + 1 ? style.active : ""}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className={style.page_btn}
                                disabled={page === pagination?.last_page}
                                onClick={() => setPage(page + 1)}
                            >
                                {isArabic ? <IconChevronLeft size={17} /> : <IconChevronRight size={17} />}
                            </button>
                        </div>
                    )}
                </>)}
            </div>
        </div>
    );
};

export default AllAuctions;

