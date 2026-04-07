import style from './features.module.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { fetchBanners } from './../../../Redux/Slices/contentSlice';
const Features = () => {
    const { language, isArabic, t } = useLanguage();
    const dispatch = useDispatch();
    const bannersState = useSelector((state) => state.content.banners);

    useEffect(() => {
    if (bannersState.status === "idle" || bannersState.language !== language) {
      dispatch(fetchBanners());
    }
  }, [dispatch, bannersState.status, bannersState.language, language]);

    return (
        <div className={`${style.features} bg-light py-5`}>
            <div className="container">
                <h2 className="text-center fw-medium mb-4">{t.common.myCarAuction}</h2>

                {bannersState.status === "loading" && (
                    <div className="text-center py-5">{t.common.loading}</div>
                )}
                {bannersState.error && (
                    <div className="alert alert-danger my-3">{bannersState.error}</div>
                )}

                <div className="row">
                    {bannersState.data && bannersState.data.length > 0
                        ? bannersState.data.map((banner) => (
                            <div
                                key={banner.id}
                                className="col-xl-4 col-lg-4 col-md-6 col-12"
                            >
                                <div
                                    className={`${style.image} shadow-sm my-2 rounded-4 overflow-hidden`}
                                >
                                    <img
                                        alt={banner.title}
                                        src={banner.image || "/placeholder.png"}
                                        className="w-100"
                                    />
                                </div>
                            </div>
                        ))
                        : null}
                </div>
            </div>
        </div>
    );
};

export default Features;