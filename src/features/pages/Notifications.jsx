import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchNotifications } from "../../Redux/Slices/contentSlice";
import PageShell from "../../shared/components/PageShell";
import StateView from "../../shared/components/StateView";
import { fadeUp, staggerContainer } from "../../shared/animations/motion";
import { useLanguage } from "../../shared/i18n/LanguageProvider";
import { IconBellRingingFilled, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const NotificationsPage = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();

  const { data, status, error, pagination } = useSelector(
    (state) => state.content.notifications
  );

  const currentPage = pagination?.current_page || 1;
  const lastPage = pagination?.last_page || 1;


 useEffect(() => {
  dispatch(fetchNotifications(1));
}, [language, dispatch]);

const changePage = (newPage) => {
  if (newPage < 1 || newPage > lastPage) return;

  dispatch(fetchNotifications(newPage));
};

  return (
    <PageShell title={t.notifications.title}>
      <StateView loading={status === "loading"} error={error}>
        <motion.div
          className="row g-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {(data || []).length > 0 ? (
            (data || []).map((item) => (
              <motion.div
                className="col-12"
                key={item.id || item.created_at}
                variants={fadeUp}
              >
                <div className="bg-white rounded-4 p-4 shadow-sm d-flex align-items-start">
                  <div className="alert alert-info mx-2">
                    <IconBellRingingFilled stroke={1} size={18} />
                  </div>

                  <div>
                    <h2 className="h6 mb-2">{item?.title}</h2>
                    <p className="text-secondary lh-base mb-2">
                      {item?.body}
                    </p>
                    <small className="bg-light text-secondary px-3 py-1 rounded-5">
                      {item?.created_at}
                    </small>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div className="col-12" variants={fadeUp}>
              <div className="bg-white rounded-4 p-4 shadow-sm text-center">
                <IconBellRingingFilled
                  stroke={1}
                  className="sub-color"
                  size={22}
                />
                <h5 className="main-color my-3 fw-normal text-md">
                  {t.notifications.nodata}
                </h5>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-outline-primary btn-sm"
              disabled={currentPage === 1}
              onClick={() => changePage(currentPage - 1)}
            >
              <IconChevronRight size={15}/>
            </button>

            <span className="px-3">
              {currentPage} / {lastPage}
            </span>

            <button
              className="btn btn-outline-primary btn-sm"
              disabled={currentPage === lastPage}
              onClick={() => changePage(currentPage + 1)}
            >
              <IconChevronLeft size={15}/>
            </button>
          </div>
        )}
      </StateView>
    </PageShell>
  );
};

export default NotificationsPage;