import style from "./AuctionDetails.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Countdown from "react-countdown";
import * as bootstrap from 'bootstrap';
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
  IconCalendarEvent,
  IconMapPin,
  IconFileDescription,
  IconPhoto,
  IconInfoSquare,
  IconMinus,
  IconInfoCircle,
  IconPlus
} from "@tabler/icons-react";
import { acceptOffer, fetchAllBids, fetchAuctionDetails, postBid } from "../../../Redux/Slices/auctionsSlice";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AuctionDetails = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const dispatch = useDispatch();
  const [loadingBidId, setLoadingBidId] = useState(null);
  const { data: record, status, language: dataLanguage } =
    useSelector((state) => state.auctions.auctionDetails);
  const { data: bids } =
    useSelector((state) => state.auctions.allBids);
  const postBidState = useSelector((state) => state.auctions.postBid);
  const acceptOfferState = useSelector((state) => state.auctions.acceptOffer);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (status === "idle" || dataLanguage !== language) {
      dispatch(fetchAuctionDetails(id));
      dispatch(fetchAllBids(id));
    }
  }, [status, dataLanguage, language, dispatch, id]);
  useEffect(() => {
    if (postBidState.status === "succeeded") {
      const audio = new Audio("/notification.mp3");
      audio.volume = 1;
      audio.play().catch(() => { });
      toast.success(postBidState.data?.message || t.auctions.bid_submitted_successfully, {
        onClose: () => window.location.reload()
      });

      const modalEl = document.getElementById("presentOfferModal");
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();

      setBidValue(0);
    } else if (postBidState.status === "failed") {
      toast.error(postBidState.error || t.auctions.failed_to_submit_bid);
    }
  }, [postBidState,t]);

  useEffect(() => {
    if (acceptOfferState.status === "succeeded") {
      toast.success(acceptOfferState.data?.message || t.auctions.offer_accepted_successfully, {
        onClose: () => window.location.reload()
      });

    } else if (acceptOfferState.status === "failed") {
      toast.error(acceptOfferState.error || t.auctions.failed_to_accept_offer);
    }
  }, [acceptOfferState,t]);

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

  // present offer logic
  const [bidValue, setBidValue] = useState(0); // start from 0
  const highestBid = Number(record?.pricing?.highest_bid || 0);

  const handleIncrease = () => setBidValue((prev) => prev + 1000); // optional increment
  const handleDecrease = () => setBidValue((prev) => (prev - 1000 >= highestBid ? prev - 1000 : highestBid));

  // check user before showing present offer modal or button
  const handlePresentOffer = () => {
    if (!user) {
      toast.info(t.nav.please_login);
      return;
    }

    if (user.role !== "buyer") {
      toast.warning(t.nav.please_create_buyer_account);
      return;
    }

    // User is valid, show Bootstrap modal using JS
    const modalEl = document.getElementById("presentOfferModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };
  const handleBidChange = (e) => {
    let value = e.target.value;

    value = value.replace(/\D/g, "");
    setBidValue(value ? Number(value) : 0);
  };
  // handle submitting offer
  const handleSubmitOffer = () => {

    const price = Number(bidValue);

    if (!price || price <= highestBid) {
      toast.warning(t.auctions.validationHigherThanHighest);
      return;
    }

    const payload = {
      auction_id: id,
      price,
    };

    dispatch(postBid(payload));
  };

  //  handle accept offer
  const handleAcceptOffer = async (bidId) => {
  if (loadingBidId) return;

  setLoadingBidId(bidId);

  try {
    const response = await dispatch(acceptOffer(bidId)).unwrap();

    toast.success(response?.message || t.common.success);

  } catch (error) {
    toast.error(error?.message || t.common.error);
  } finally {
    setLoadingBidId(null);
  }
};
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

                    {/* Car Info Title */}
                    <div className="col-12">
                      <h5 className="mb-3"><IconInfoSquare size={20} className="me-2 sub-color" /> {t.auctions.carInfo}</h5>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.carName}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.model}</p>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.carType}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.brand?.name}</p>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.manufactureDate}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.manufacture_date}</p>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.kilos}:</b>
                        <p className="text-secondary mt-2 mb-0">
                          {record?.kilos} {t.auctions.km}
                        </p>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.color}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.color}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    {/* <div className="col-12 mt-3">
                      <h5 className="mb-3"><IconCash size={20} className="me-2 sub-color" /> {t.auctions.pricingInfo}</h5>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <div className="alert alert-primary px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.sellingPrice}:</b>
                        <p className="text-secondary mt-2 mb-0">
                          {record?.pricing?.selling_price} {t.auctions.pounds}
                        </p>
                      </div>
                    </div> */}

                    {/* Dates */}
                    <div className="col-12 mt-3">
                      <h5 className="mb-3"><IconCalendarEvent size={20} className="me-2 sub-color" /> {t.auctions.auctionDates}</h5>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.startDate}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.start_date}</p>
                      </div>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.endDate}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.end_date}</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="col-12 mt-3">
                      <h5 className="mb-3"><IconMapPin size={20} className="me-2 sub-color" /> {t.auctions.locationInfo}</h5>
                    </div>

                    <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <b className="d-block fw-normal">{t.auctions.address}:</b>
                        <p className="text-secondary mt-2 mb-0">{record?.address}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="col-12 mt-3">
                      <h5 className="mb-3"><IconFileDescription size={20} className="me-2 sub-color" /> {t.auctions.description}</h5>
                      <div className="bg-light px-4 py-2 rounded-3 my-2">
                        <p className="text-secondary lh-base mb-0">
                          {record?.description}
                        </p>
                      </div>
                    </div>

                    {/* Report */}
                    <div className="col-12 mt-3">
                      <h5 className="mb-3">{t.auctions.report}</h5>
                      <div className="bg-light px-4 py-2 rounded-3 my-2 d-flex align-items-center">
                        <img
                          alt="pdf"
                          src="/pdf.png"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="mx-2">
                          <Link to={record?.report} target="_blank">
                            {t.auctions.link}
                          </Link>
                        </span>
                      </div>
                    </div>

                    {/* Images */}
                    <div className="col-12 mt-3">
                      <h5 className="mb-3"><IconPhoto size={20} className="me-2 sub-color" /> {t.auctions.carImages}</h5>
                      <div className="bg-light px-4 py-2 rounded-3 my-2 d-flex flex-wrap">
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

                                {record?.status === "active" && (
                                  <button
                                    className={style.accept_offer}
                                    onClick={() => handleAcceptOffer(bid?.id)}
                                    disabled={loadingBidId === bid?.id}
                                  >
                                    {loadingBidId === bid?.id
                                      ? t.common.loading
                                      : t.auctions.acceptOffer}
                                  </button>
                                )}
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
                type="button"
                className={style.present_offer}
                onClick={handlePresentOffer}
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
      {/* modal */}
      <div
        className="modal fade"
        id="presentOfferModal"
        tabIndex="-1"
        aria-labelledby="presentOfferModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title" id="presentOfferModalLabel">
                {t.auctions.presentOffer}
              </h5>
              <button
                type="button"
                className="btn-close m-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* Your present_offer_card JSX */}
              <div className={style.present_offer_card}>
                <small className="text-secondary d-block">
                  {t.auctions.presentOffer}
                </small>

                <span className="text-dark d-block my-2">
                  {t.auctions.currentHighestBid}
                </span>

                <strong className="sub-color">
                  {highestBid} {t.auctions.pounds}
                </strong>

                <div className="d-flex align-items-center justify-content-evenly my-2">
                  <button className={[style.increase, style.bid_value_btn].join(" ")} type="button" onClick={handleIncrease}>
                    <IconPlus />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={bidValue}
                    onChange={handleBidChange}
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === "e" || e.key === "-") {
                        e.preventDefault();
                      }
                    }}
                    className={`${style.bid_value} text-center`}
                    placeholder={t.auctions.enterBid}
                  />

                  <button className={[style.decrease, style.bid_value_btn].join(" ")} type="button" onClick={handleDecrease}>
                    <IconMinus />
                  </button>
                </div>

                <span className="d-block mt-2 text-secondary text-sm">
                  <IconInfoCircle size={16} className="text-danger me-2" />{" "}
                  {t.auctions.minimumBid} 0 {t.auctions.pounds}
                </span>

                <div className="alert alert-info mt-2 text-sm">
                  <IconInfoCircle className="sub-color me-2" size={16} />
                  {t.auctions.extendAuctionNotice}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t.auctions.cancel}
              </button>
              <button
                className="btn btn-success px-4"
                onClick={handleSubmitOffer}
                disabled={postBidState.status === "loading"}
              >
                {postBidState.status === "loading"
                  ? t.common.loading
                  : t.createAd.confirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuctionDetails;