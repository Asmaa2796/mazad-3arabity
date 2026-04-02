import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import PageShell from "../../shared/components/PageShell";
import { submitContactForm } from "../../Redux/Slices/contactSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";

const ContactPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { status, error, success } = useSelector((state) => state.contact.submit);
  const loading = status === "loading";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const fields = [
    { key: "name", type: "text", label: t.contact.name, placeholder: t.contact.placeholders.name },
    { key: "email", type: "email", label: t.contact.email, placeholder: t.contact.placeholders.email },
    { key: "phone", type: "text", label: t.contact.phone, placeholder: t.contact.placeholders.phone },
    { key: "subject", type: "text", label: t.contact.subject, placeholder: t.contact.placeholders.subject },
  ];

  const isDisabled = useMemo(
    () => loading || Object.values(form).some((value) => String(value).trim().length === 0),
    [form, loading]
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(submitContactForm(form));
  };

  return (
    <PageShell
      title={t.contact.title}
      description={t.contact.desc}
      cta={{ title: t.contact.ctaTitle, text: t.contact.ctaText }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white rounded-4 p-4 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="row g-3">
          {fields.map((field) => (
            <div className="col-md-6" key={field.key}>
              <label className="form-label">{field.label}</label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={field.type}
                className="form-control"
                name={field.key}
                value={form[field.key]}
                placeholder={field.placeholder}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="col-12">
            <label className="form-label">{t.contact.message}</label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              className="form-control"
              placeholder={t.contact.placeholders.message}
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
            />
          </div>
          {error ? <div className="col-12 alert alert-danger mb-0">{error}</div> : null}
          {success ? <div className="col-12 alert alert-success mb-0">{success}</div> : null}
          <div className="col-12">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={isDisabled}
              className="btn btn-main-color px-4"
              type="submit"
            >
              {loading ? t.contact.sending : t.contact.send}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </PageShell>
  );
};

export default ContactPage;
