import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { fetchFaqs } from "../../Redux/Slices/contentSlice";
import PageShell from "../../shared/components/PageShell";
import StateView from "../../shared/components/StateView";
import { fadeUp, staggerContainer } from "../../shared/animations/motion";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const FaqsPage = () => {
  const { t, language } = useLanguage();
  const dispatch = useDispatch();
  const { data, status, error, language: dataLanguage } = useSelector((state) => state.content.faqs);

  useEffect(() => {
    if (status === "idle" || dataLanguage !== language) dispatch(fetchFaqs());
  }, [status, dataLanguage, language, dispatch]);

  return (
    <PageShell
      title={t.faq.title}
      description={t.faq.desc}
      cta={{
        title: t.faq.ctaTitle,
        text: t.faq.ctaText,
      }}
    >
      <StateView loading={status === "loading"} error={error}>
        <motion.div className="row g-3" variants={staggerContainer} initial="hidden" animate="visible">
          {(data || []).map((item, index) => (
            <motion.div className="col-12" key={`${item.question}-${index}`} variants={fadeUp}>
              <div className="bg-white rounded-4 p-4 shadow-sm">
                <h2 className="h6 mb-2">{item.question}</h2>
                <p className="text-secondary mb-0">{item.answer}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </StateView>
    </PageShell>
  );
};

export default FaqsPage;
