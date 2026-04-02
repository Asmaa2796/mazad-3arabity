import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "../animations/motion";

const PageShell = ({ title, description, cta, children }) => {
  return (
    <motion.main
      className="bg-light min-vh-100"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <section className="container py-5">
        <motion.div className="p-4 p-md-5 rounded-4 bg-white shadow-sm mb-4" variants={fadeUp}>
          <h1 className="h3 mb-3">{title}</h1>
          <p className="text-secondary mb-0">{description}</p>
        </motion.div>
        {children}
        {cta ? (
          <motion.div variants={fadeUp} className="p-4 rounded-4 mt-4 main-bg text-white">
            <h2 className="h5 mb-2">{cta.title}</h2>
            <p className="mb-0">{cta.text}</p>
          </motion.div>
        ) : null}
      </section>
    </motion.main>
  );
};

export default PageShell;
