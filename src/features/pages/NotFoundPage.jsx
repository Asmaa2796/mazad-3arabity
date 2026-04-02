import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const NotFoundPage = () => {
  const { t } = useLanguage();
  return (
    <motion.main
      className="container py-5 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="display-4 fw-bold">404</h1>
      <p className="text-secondary">{t.notFound.text}</p>
      <Link className="btn btn-main-color" to="/">
        {t.notFound.back}
      </Link>
    </motion.main>
  );
};

export default NotFoundPage;
