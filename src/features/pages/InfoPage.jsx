import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import PageShell from "../../shared/components/PageShell";
import StateView from "../../shared/components/StateView";
import { fadeUp } from "../../shared/animations/motion";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const InfoPage = ({ type, fetchThunk }) => {
  const { isArabic, language } = useLanguage();
  const dispatch = useDispatch();
  const section = useSelector((state) => state.content[type]);
  const item = section?.data;
  const config = {
    about: {
      title: isArabic ? "عن مزاد عربيتي" : "About Mazad Cars",
      fallback: isArabic
        ? "تعرف على مهمتنا وتجربة مزادات السيارات."
        : "Learn more about our mission and vehicle auction experience.",
      cta: isArabic
        ? { title: "ابدأ رحلتك", text: "اكتشف المزادات المباشرة وابدأ المزايدة اليوم." }
        : { title: "Start your journey", text: "Discover live auctions and place your next bid today." },
    },
    privacy: {
      title: isArabic ? "سياسة الخصوصية" : "Privacy Policy",
      fallback: isArabic
        ? "خصوصية بياناتك وأمان معلوماتك من أولوياتنا."
        : "Your information security and privacy are core priorities.",
      cta: isArabic
        ? { title: "بياناتك محمية", text: "نطبق معايير أمان عالية في كل المعاملات." }
        : { title: "Your data is protected", text: "We apply secure standards across every transaction and account." },
    },
    terms: {
      title: isArabic ? "الشروط والأحكام" : "Terms & Conditions",
      fallback: isArabic
        ? "يرجى مراجعة الشروط المنظمة لاستخدام المنصة والمزايدة."
        : "Please review the terms that govern platform usage and bidding.",
      cta: isArabic
        ? { title: "قواعد عادلة", text: "سياسات واضحة تضمن تجربة آمنة للمشترين والبائعين." }
        : { title: "Fair auction rules", text: "Transparent policies keep auctions safe for buyers and sellers." },
    },
  };
  const page = config[type];

  useEffect(() => {
    if (section?.status === "idle" || section?.language !== language) {
      dispatch(fetchThunk());
    }
  }, [dispatch, fetchThunk, section?.status, section?.language, language]);

  return (
    <PageShell
      title={item?.title || page.title}
      description={item?.description || page.fallback}
      cta={page.cta}
    >
      <StateView loading={section?.status === "loading"} error={section?.error}>
        <motion.section variants={fadeUp} className="row g-4 align-items-center">
          <div className="col-md-5">
            <img
              src={item?.image || item?.banner || "/logo.png"}
              className="img-fluid rounded-4 shadow-sm bg-white p-2"
              alt={item?.title || page.title}
            />
          </div>
          <div className="col-md-7">
            <div className="bg-white rounded-4 p-4 shadow-sm">
              <h2 className="h5 mb-3">{item?.title || page.title}</h2>
              <p className="text-secondary mb-0">{item?.description || page.fallback}</p>
            </div>
          </div>
        </motion.section>
      </StateView>
    </PageShell>
  );
};

export default InfoPage;
