import style from "./AuctionDetails.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Countdown from "react-countdown";
import "swiper/css";
import "swiper/css/pagination";
import {
  IconEye,
  IconGavel,
  IconCash,
  IconCalendarWeek,
  IconStopwatch,
  IconClock,
  IconPhone,
  IconTrophy,
} from "@tabler/icons-react";
import { fetchAllBids, fetchAuctionDetails } from "../../../Redux/Slices/auctionsSlice";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const AuctionDetails = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const dispatch = useDispatch();
  const { data: record, status, language: dataLanguage } =
    useSelector((state) => state.auctions.auctionDetails);
  const { data: bids } =
    useSelector((state) => state.auctions.allBids);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "idle" || dataLanguage !== language) {
      dispatch(fetchAuctionDetails(id));
      dispatch(fetchAllBids(id));
    }
  }, [status, dataLanguage, language, dispatch, id]);
  const images =
    record?.gallery?.length
      ? record.gallery
      : record?.main
        ? [{ img: record.main }]
        : [{ img: "/car_placeholder.jpg" }];
  // timer
  const remaining = record?.remaining_time;

  const targetDate = remaining
    ? Date.now() +
      remaining.days * 24 * 60 * 60 * 1000 +
      remaining.hours * 60 * 60 * 1000 +
      remaining.minutes * 60 * 1000
    : null;

  // const handlePresentOffer = () => {
  //   if (!user) {
  //     toast.info(t.nav.please_login);
  //     return;
  //   }
  //   if (user.role !== "seller") {
  //     toast.warning(t.nav.please_create_buyer_account);
  //     return;
  //   }
  //   // Proceed with offer logic here
  // };

  return (
    <>
      {status === "loading" ? (
        <div className="text-center p-5">
          <span>{t.common.loading}</span>
        </div>
      ) : record ? (
        <div className={`${style.auction_details} py-5`}>
          <div className="container">
            <h4 className="fw-medium mb-4">{t.auctions.details}</h4>
            {/* car swiper */}
            <div className={style.car_swiper}>
              <Swiper
                modules={[Autoplay, Pagination]}
                loop={images.length > 1}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                className={style.card_swiper}
              >
                {images.map((g, i) => {
                  const imgSrc = g?.img || g?.image || g;

                  return (
                    <SwiperSlide key={g?.id || i}>
                      <div
                        className={style.car_img}
                        style={{ backgroundImage: `url(${imgSrc})` }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
            {/* car info */}
            <div className={style.car_info}>
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <div className="d-flex align-items-start my-2">
                    <IconCash className="sub-color mx-2" size={20} />
                    <div>
                      <span className="text-secondary d-block">
                        {t.auctions.highestPrice}
                      </span>
                      <span className="d-block">{record?.pricing?.highest_bid} {t.auctions.pounds}</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <div className="d-flex align-items-start my-2">
                    <IconGavel className="sub-color mx-2" size={20} />
                    <div>
                      <span className="text-secondary d-block">
                        {t.auctions.bidsCount}
                      </span>
                      <span className="d-block">{record?.pricing?.bids_count}</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <div className="d-flex align-items-start my-2">
                    <IconEye className="sub-color mx-2" size={20} />
                    <div>
                      <span className="text-secondary d-block">
                        {t.auctions.viewsCount}
                      </span>
                      <span className="d-block">{record?.views}</span>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <div className="d-flex align-items-start my-2">
                    <IconCalendarWeek className="sub-color mx-2" size={20} />
                    <div>
                      <span className="text-secondary d-block">
                        {t.auctions.published}
                      </span>
                      <span className="d-block">{record?.published_since}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* car timer */}
            <div className={`${style.car_timer} my-4`}>
              <h2 className="text-center sub-color d-flex align-items-center justify-content-center">
                {record?.status === "sold" ? (
                  <span className="text-secondary">{t.auctions.sold}</span>
                ) : (
                  <Countdown
                    key={targetDate}
                    date={targetDate}
                    renderer={({ days, hours, minutes, completed }) => {
                      if (completed) return <span className="text-secondary">{t.auctions.sold}</span>;
                      return (
                        <>
                          <span>
                            {days} {t.auctions.days}{" "}
                            {hours} {t.auctions.hours}{" "}
                            {minutes} {t.auctions.minutes}
                          </span>
                          <IconStopwatch size={30} className="mx-2" />
                        </>
                      );
                    }}
                  />
                )}
              </h2>
            </div>

            {/* car details tabs */}
            <div className={`${style.car_tabs}`}>
              <div className="my-5">
                <h5>{record?.model}</h5>
                <p className="lh-base text-secondary">
                  {record?.description}
                </p>
              </div>
            </div>
            <ul className="nav nav-tabs p-0 flex-nowrap" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link fw-bold active text-nowrap"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="home-tab-pane"
                  aria-selected="true"
                >
                  {t.auctions.details}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link fw-bold text-nowrap"
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="profile-tab-pane"
                  aria-selected="false"
                >
                  {t.auctions.offersSubmitted}
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="home-tab-pane"
                role="tabpanel"
                aria-labelledby="home-tab"
                tabIndex="0"
              >
                <div className="p-4 my-3">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.carName}:</b>
                      <p className="text-secondary my-2">{record?.model}</p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.description}:</b>
                      <p className="text-secondary lh-base">
                        {record?.description}
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.carType}:</b>
                      <p className="text-secondary lh-base">{record?.brand?.name}</p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.manufactureDate}:</b>
                      <p className="text-secondary my-2">{record?.manufacture_date}</p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.sellingPrice}:</b>
                      <p className="text-secondary my-2">
                        {record?.pricing?.selling_price} {t.auctions.pounds}
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.kilos}:</b>
                      <p className="text-secondary my-2">
                        {record?.kilos} {t.auctions.km}
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.color}:</b>
                      <p className="text-secondary my-2">{record?.color}</p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.startDate}:</b>
                      <p className="text-secondary my-2">{record?.start_date}</p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.endDate}:</b>
                      <p className="text-secondary my-2">{record?.end_date}</p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.startPrice}:</b>
                      <p className="text-secondary my-2">
                        {record?.pricing?.min_increment} {t.auctions.pounds}
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.minBid}:</b>
                      <p className="text-secondary my-2">
                        {record?.pricing?.min_price} {t.auctions.pounds}
                      </p>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.address}:</b>
                      <p className="text-secondary my-2">
                        {record?.address}
                      </p>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.report}:</b>
                      <div className="d-flex align-items-center my-2">
                        <img
                          alt="placeholder"
                          className="object-fit-cover"
                          src="/pdf.png"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="mx-2 text-sm">
                          <Link to={record?.report} target="_blank" rel="noopener noreferrer">{t.auctions.link}</Link>
                        </span>
                        {/* <small className="text-success">
                          ({t.auctions.reportSize})
                        </small> */}
                      </div>
                    </div>

                    <div className="col-xl-12"></div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <b className="d-block fw-medium">{t.auctions.carImages}:</b>
                      <div className="d-flex flex-wrap">
                        {images?.map((i, index) => {
                          const imgSrc = i?.img || i?.image || i;

                          return (
                            <img
                              key={index}
                              alt="car"
                              src={imgSrc}
                              className="img-thumbnail object-fit-cover mx-1 my-2"
                              style={{ width: "90px", height: "90px" }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="tab-pane fade"
                id="profile-tab-pane"
                role="tabpanel"
                aria-labelledby="profile-tab"
                tabIndex="0"
              >
                <div className="my-3 p-4">
                  {Array.isArray(bids) && bids.length > 0 ? (
                    <div className="row">
                      {bids.map((bid) => (

                        <div key={bid?.id} className="col-xl-6 col-lg-6 col-md-6 col-12">
                          <div className={style.offer_card}>
                            {bid?.is_winner && <div className={style.is_winner}><IconTrophy size={14} /> {t.auctions.isWinner}</div>}
                            <div className="d-flex align-content-start justify-content-between">
                              <div>
                                <div className="d-flex align-items-center">
                                  <img
                                    src={bid?.user?.image || "/image.jpg"}
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "50%",
                                    }}
                                    alt="img"
                                    className="object-fit-cover"
                                  />
                                  <div className="mx-1">
                                    <span className="text-dark d-block">{bid?.user?.name}</span>
                                    <span className="sub-color d-block">
                                      {bid?.price} {t.auctions.pounds}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className="text-secondary text-sm">
                                  <IconClock size={15} /> {bid?.time_ago}
                                </span>
                                <div className="text-sm text-secondary">{bid?.created_at}</div>
                              </div>
                            </div>
                            {record?.meta?.is_owner && (
                              <>
                                <span className="sub-color my-3 d-flex justify-content-center align-items-center fw-medium text-center" style={{ direction: "ltr" }}>
                                  {bid?.user?.phone} <IconPhone size={16} />
                                </span>
                                <button className={style.accept_offer}>{t.auctions.acceptOffer}</button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <img className="d-block mx-auto" style={{ width: "auto", maxHeight: "60px" }} src="/gavel.png" alt={t.common.noBidding} />
                      <h5 className="main-color my-3 fw-normal text-md">{t.common.noBidding}</h5>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {record?.status === "sold" ? (
              <button className={style.sold} disabled>{t.auctions.sold}</button>
            ) : (
              <button 
                className={style.present_offer}
                onClick={() => {
                  if (!user) {
                    toast.info(t.nav.please_login);
                    return;
                  }
                  if (user.role === "seller") {
                    toast.warning(t.nav.please_create_buyer_account);
                    return;
                  }
                  // Proceed with offer logic here
                }}
              >
                {t.auctions.presentOffer}
              </button>
            )}

          </div>
        </div>
      ) : (
        <div className="container">
          <div className="text-center p-5 border shadow-sm rounded-4 my-4">
            <img className="d-block mx-auto" style={{ width: "auto", maxHeight: "60px" }} src="/gavel.png" alt={t.common.noBidding} />
            <h5 className="main-color my-3 fw-normal text-md">{t.auctions.noAuctions}</h5>
          </div>
        </div>
      )}
    </>
  );
};

export default AuctionDetails;
