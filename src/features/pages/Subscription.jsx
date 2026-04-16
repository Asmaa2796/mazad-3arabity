import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../Redux/Slices/authSlice";
import { subscribeUser, clearSubscriptionState } from "../../Redux/Slices/subscriptionSlice";
import { useLanguage } from "../../shared/i18n/LanguageProvider";
import { toast } from "react-toastify";
import { IconCheck, IconCreditCard } from "@tabler/icons-react";

const Subscription = () => {
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const { user, token } = useSelector((state) => state.auth);
  const { subscribe } = useSelector((state) => state.subscription);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  useEffect(() => {
    if (subscribe.status === "succeeded") {
      const redirectUrl = subscribe.data?.data?.redirect_url;

      toast.success(subscribe.success, {
        onClose: () => {
          dispatch(clearSubscriptionState("subscribe"));
          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        },
      });
    }

    if (subscribe.status === "failed") {
      toast.error(subscribe.error);
      dispatch(clearSubscriptionState("subscribe"));
    }
  }, [subscribe.status, dispatch,subscribe.data?.data?.redirect_url,subscribe.error,subscribe.success]);

  const handleSubscribe = () => {
    dispatch(subscribeUser());
  };

  if (!token) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">{t.nav.please_login}</div>
      </div>
    );
  }

  const isSubscribed = user?.is_subscribed;
  const subscription_price = user?.subscription_price;
  const subscription_ends_at = user?.subscription_ends_at;

  return (
    <main className="container py-5 min-vh-100 d-flex align-items-center">
      <motion.section
        className="bg-white rounded-4 shadow-sm p-4 p-md-5 w-100"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ maxWidth: "500px", margin: "0 auto" }}
      >
        <div className="text-center mb-4">
          <IconCreditCard size={64} className="text-primary mb-3" />
          <h1 className="h3 mb-3">{t.subscription.title}</h1>
          <p className="text-muted mb-0">
            {isSubscribed
              ? t.subscription.already_subscribed
              : t.subscription.subtitle
            }
          </p>
          {isSubscribed ? (
            <div className="text-center mt-3 p-4 bg-success-subtle rounded-3">
              <IconCheck size={48} className="text-success mb-3" />
              <h4 className="text-success mb-2">{t.subscription.subscribed_title}</h4>
              <p className="text-success-emphasis mb-0">{t.subscription.subscribed}</p>
            </div>
          ) : (
            <button
              className="btn btn-primary mt-3 w-100 py-3 rounded-3 shadow-sm text-white position-relative"
              onClick={handleSubscribe}
              disabled={subscribe.status === "loading"}
            >
              {subscribe.status === "loading" ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {t.subscription.subscribing}
                </>
              ) : (
                <>
                  <IconCreditCard size={20} className="me-2" />
                  {t.subscription.pay_subscribe}
                </>
              )}
            </button>
          )}
          {isSubscribed && (
            <>
              <span className="d-block my-3">{t.subscription.subscription_price} : {subscription_price} {t.auctions.pounds}</span>
              <span className="d-block bg-light rounded-5 px-4 py-1 border">{t.subscription.ends_at} : {subscription_ends_at}</span>
              <div className="alert alert-info my-3">{t.subscription.the_subscription_ends_when_you_buy_or_sell_a_car}</div>
            </>
          )}

        </div>

      </motion.section>
    </main>
  );
};

export default Subscription;

