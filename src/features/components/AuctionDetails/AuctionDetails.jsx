import style from "./AuctionDetails.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import {
  IconEye,
  IconGavel,
  IconCash,
  IconCalendarWeek,
  IconStopwatch,
  IconClock,
  IconPhoneCall,
} from "@tabler/icons-react";

const AuctionDetails = () => {
  const gallery = [
    { id: 1, img: "/5.jpg" },
    { id: 2, img: "/6.jpg" },
    { id: 3, img: "/4.jpg" },
  ];
  return (
    <div className={`${style.auction_details} py-5`}>
      <div className="container">
        <h4 className="fw-medium mb-4">تفاصيل المزاد</h4>
        {/* car swiper */}
        <div className={style.car_swiper}>
          <div className={style.new_auction}>مزاد جديد</div>
          <Swiper
            modules={[Autoplay, Pagination]}
            loop
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className={style.card_swiper}
          >
            {gallery.map((g, i) => (
              <SwiperSlide key={g.id || i}>
                <div
                  className={style.car_img}
                  style={{ backgroundImage: `url(${g.img})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* car info */}
        <div className={style.car_info}>
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-start my-2">
                <IconCash className="sub-color mx-2" size={20} />
                <div>
                  <span className="text-secondary d-block">أعلي سعر</span>
                  <span className="d-block">250,000</span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-start my-2">
                <IconGavel className="sub-color mx-2" size={20} />
                <div>
                  <span className="text-secondary d-block">عدد المزايدات</span>
                  <span className="d-block">12</span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-start my-2">
                <IconEye className="sub-color mx-2" size={20} />
                <div>
                  <span className="text-secondary d-block">عددالمشاهدات</span>
                  <span className="d-block">5000</span>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-12">
              <div className="d-flex align-items-start my-2">
                <IconCalendarWeek className="sub-color mx-2" size={20} />
                <div>
                  <span className="text-secondary d-block">النشر</span>
                  <span className="d-block">منذ يومين</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* car timer */}
        <div className={`${style.car_timer} my-4`}>
          <h2 className="text-center sub-color d-flex align-items-center justify-content-center">
            <span>00:22:10 </span>
            <IconStopwatch size={30} />
          </h2>
        </div>
        {/* car details tabs */}
        <div className={`${style.car_tabs}`}>
          <div className="my-5">
            <h5>مرسيدس C180</h5>
            <p className="lh-base text-secondary">
              مرسيدس C180 – فخامة ألمانية وأداء ثابت، عربية نظيفة ومتمسكة بتقدم
              تجربة قيادة مريحة وقوية .
            </p>
          </div>
        </div>
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link fw-bold active"
              id="home-tab"
              data-bs-toggle="tab"
              data-bs-target="#home-tab-pane"
              type="button"
              role="tab"
              aria-controls="home-tab-pane"
              aria-selected="true"
            >
              تفاصيل المزاد
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link fw-bold"
              id="profile-tab"
              data-bs-toggle="tab"
              data-bs-target="#profile-tab-pane"
              type="button"
              role="tab"
              aria-controls="profile-tab-pane"
              aria-selected="false"
            >
              العروض المقدمة
            </button>
          </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div
            class="tab-pane fade show active"
            id="home-tab-pane"
            role="tabpanel"
            aria-labelledby="home-tab"
            tabindex="0"
          >
            <div className="p-4 my-3">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">اسم السيارة:</b>
                  <p className="text-secondary my-2">مرسيدس C180</p>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">الوصف:</b>
                  <p className="text-secondary lh-base">
                    مرسيدس C180 موديل 2024 بحالة ممتازة
                  </p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">نوع السيارة:</b>
                  <p className="text-secondary lh-base">مرسيدس</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">موديل السيارة:</b>
                  <p className="text-secondary my-2">2024</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">السعر المناسب للبيع:</b>
                  <p className="text-secondary my-2">2,000,000 جنيه</p>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">الكيلو متر:</b>
                  <p className="text-secondary my-2">360 كم</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">اللون:</b>
                  <p className="text-secondary my-2">أزرق</p>
                </div>

                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">تاريخ بدء المزاد:</b>
                  <p className="text-secondary my-2">22-12-2025</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">تاريخ انتهاء المزاد:</b>
                  <p className="text-secondary my-2">22-12-2025</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">السعر الابتدائي:</b>
                  <p className="text-secondary my-2">250,000 جنيه</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">اقل سعر للمزايدة:</b>
                  <p className="text-secondary my-2">5,000 جنيه</p>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">تقرير السيارة</b>
              <div className="d-flex align-items-center my-2">
                <img alt="image" className="object-fit-cover" src="/pdf.png" style={{ width: "30px", height: "30px" }} />
                <span className="mx-2 text-sm">تقرير سيارة C180</span>
                <small className="text-success">(2 ميجا بايت)</small>
              </div>
              
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-12"></div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">

                  <b className="d-block fw-medium">صور السيارة:</b>
                  <div className="d-flex">
                    <img
                      alt="image"
                      src="/5.jpg"
                      className="img-thumbnail object-fit-cover mx-1 my-2"
                      style={{ width: "90px", height: "90px" }}
                    />
                    <img
                      alt="image"
                      src="/6.jpg"
                      className="img-thumbnail object-fit-cover mx-1 my-2"
                      style={{ width: "90px", height: "90px" }}
                    />
                    <img
                      alt="image"
                      src="/4.jpg"
                      className="img-thumbnail object-fit-cover mx-1 my-2"
                      style={{ width: "90px", height: "90px" }}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-12">
                  <b className="d-block fw-medium">صور رخصة السيارة:</b>
                  <div className="d-flex">
                    <img
                      alt="image"
                      src="/image.jpg"
                      className="img-thumbnail object-fit-cover mx-1 my-2"
                      style={{ width: "90px", height: "90px" }}
                    />
                    <img
                      alt="image"
                      src="/image.jpg"
                      className="img-thumbnail object-fit-cover mx-1 my-2"
                      style={{ width: "90px", height: "90px" }}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="profile-tab-pane"
            role="tabpanel"
            aria-labelledby="profile-tab"
            tabindex="0"
          >
            <div className="my-3 p-4">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <div className={style.offer_card}>
                    <div className="d-flex align-content-start justify-content-between">
                      <div>
                        <div className="d-flex align-items-center">
                          <img
                            src="/image.jpg"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                            }}
                            alt="img"
                            className="object-fit-cover"
                          />
                          <div className="mx-1">
                            <span className="text-dark d-block">محمد احمد</span>
                            <span className="sub-color d-block">
                              750,500 رس
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary">
                          <IconClock size={15} /> منذ 6 س
                        </span>
                      </div>
                    </div>
                    <span className="sub-color my-3 d-block fw-medium text-center">
                      01115252510 <IconPhoneCall size={17} />
                    </span>

                    <button className={style.accept_offer}>قبول العرض</button>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <div className={style.offer_card}>
                    <div className="d-flex align-content-start justify-content-between">
                      <div>
                        <div className="d-flex align-items-center">
                          <img
                            src="/image.jpg"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                            }}
                            alt="img"
                            className="object-fit-cover"
                          />
                          <div className="mx-1">
                            <span className="text-dark d-block">محمد احمد</span>
                            <span className="sub-color d-block">
                              750,500 رس
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary">
                          <IconClock size={15} /> منذ 6 س
                        </span>
                      </div>
                    </div>
                    <span className="sub-color my-3 d-block fw-medium text-center">
                      01115252510 <IconPhoneCall size={17} />
                    </span>

                    <button className={style.accept_offer}>قبول العرض</button>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <div className={style.offer_card}>
                    <div className="d-flex align-content-start justify-content-between">
                      <div>
                        <div className="d-flex align-items-center">
                          <img
                            src="/image.jpg"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                            }}
                            alt="img"
                            className="object-fit-cover"
                          />
                          <div className="mx-1">
                            <span className="text-dark d-block">محمد احمد</span>
                            <span className="sub-color d-block">
                              750,500 رس
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary">
                          <IconClock size={15} /> منذ 6 س
                        </span>
                      </div>
                    </div>
                    <span className="sub-color my-3 d-block fw-medium text-center">
                      01115252510 <IconPhoneCall size={17} />
                    </span>

                    <button className={style.accept_offer}>قبول العرض</button>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <div className={style.offer_card}>
                    <div className="d-flex align-content-start justify-content-between">
                      <div>
                        <div className="d-flex align-items-center">
                          <img
                            src="/image.jpg"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                            }}
                            alt="img"
                            className="object-fit-cover"
                          />
                          <div className="mx-1">
                            <span className="text-dark d-block">محمد احمد</span>
                            <span className="sub-color d-block">
                              750,500 رس
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary">
                          <IconClock size={15} /> منذ 6 س
                        </span>
                      </div>
                    </div>
                    <span className="sub-color my-3 d-block fw-medium text-center">
                      01115252510 <IconPhoneCall size={17} />
                    </span>

                    <button className={style.accept_offer}>قبول العرض</button>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <div className={style.offer_card}>
                    <div className="d-flex align-content-start justify-content-between">
                      <div>
                        <div className="d-flex align-items-center">
                          <img
                            src="/image.jpg"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                            }}
                            alt="img"
                            className="object-fit-cover"
                          />
                          <div className="mx-1">
                            <span className="text-dark d-block">محمد احمد</span>
                            <span className="sub-color d-block">
                              750,500 رس
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary">
                          <IconClock size={15} /> منذ 6 س
                        </span>
                      </div>
                    </div>
                    <span className="sub-color my-3 d-block fw-medium text-center">
                      01115252510 <IconPhoneCall size={17} />
                    </span>

                    <button className={style.accept_offer}>قبول العرض</button>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                  <div className={style.offer_card}>
                    <div className="d-flex align-content-start justify-content-between">
                      <div>
                        <div className="d-flex align-items-center">
                          <img
                            src="/image.jpg"
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                            }}
                            alt="img"
                            className="object-fit-cover"
                          />
                          <div className="mx-1">
                            <span className="text-dark d-block">محمد احمد</span>
                            <span className="sub-color d-block">
                              750,500 رس
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className="text-secondary">
                          <IconClock size={15} /> منذ 6 س
                        </span>
                      </div>
                    </div>
                    <span className="sub-color my-3 d-block fw-medium text-center">
                      01115252510 <IconPhoneCall size={17} />
                    </span>

                    <button className={style.accept_offer}>قبول العرض</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className={style.present_offer}>قدم عرض</button>
      </div>
    </div>
  );
};

export default AuctionDetails;
