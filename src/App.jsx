import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./features/components/Navbar/Navbar";
import Footer from "./features/components/Footer/Footer";
import SocialIcons from "./features/components/SocialIcons/SocialIcons";
import PageTop from "./features/components/PageTop/PageTop";
import ScrollToTopButton from "./shared/components/ScrollToTopButton";
import { pageTransition } from "./shared/animations/motion";
import { useLanguage } from "./shared/i18n/LanguageProvider";
import { fetchSettings } from "./Redux/Slices/contentSlice";
import { toast, ToastContainer } from "react-toastify";
import ProtectedRoute from "./features/components/ProtectedRoute/ProtectedRoute";
import AuthRoute from "./features/components/ProtectedRoute/AuthRoute";
import NotificationsPage from "./features/pages/Notifications";
import { onMessageListener, requestFCMToken } from "./firebase/firebase-messaging";
import { IconGavel } from "@tabler/icons-react";

const Home = lazy(() => import("./features/components/Home/Home"));
const AuctionDetails = lazy(() => import("./features/components/AuctionDetails/AuctionDetails"));
const AllAuctions = lazy(() => import("./features/components/Auctions/AllAuctions"));
const CreateAd = lazy(() => import("./features/components/CreateAd/CreateAd"));
const AboutPage = lazy(() => import("./features/pages/AboutPage"));
const PrivacyPage = lazy(() => import("./features/pages/PrivacyPage"));
const TermsPage = lazy(() => import("./features/pages/TermsPage"));
const FaqsPage = lazy(() => import("./features/pages/FaqsPage"));
const ContactPage = lazy(() => import("./features/pages/ContactPage"));
const NotFoundPage = lazy(() => import("./features/pages/NotFoundPage"));
const LoginPage = lazy(() => import("./features/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/pages/RegisterPage"));
const VerifyOtpPage = lazy(() => import("./features/pages/VerifyOtpPage"));
const ProfilePage = lazy(() => import("./features/pages/ProfilePage"));
const ForgotPasswordPage = lazy(() => import("./features/pages/ForgotPasswordPage"));
const VerifyPasswordOtpPage = lazy(() => import("./features/pages/VerifyPasswordOtpPage"));
const ResetPasswordPage = lazy(() => import("./features/pages/ResetPasswordPage"));

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t, language } = useLanguage();
  const settings = useSelector((state) => state.content.settings);

  useEffect(() => {
    if (settings.status === "idle" || settings.language !== language) {
      dispatch(fetchSettings());
    }
  }, [dispatch, settings.status, settings.language, language]);

  useEffect(() => {
    const data = settings.data;
    if (!data) return;
    if (data.title) document.title = data.title;

    if (data.metaDesc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", data.metaDesc);
    }

    if (data.favicon) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "icon");
        document.head.appendChild(link);
      }
      link.setAttribute("href", data.favicon);
    }
  }, [settings.data]);

  // fcm message
  useEffect(() => {
    requestFCMToken().then((token) => {
      if (token) {
        // console.log("FCM TOKEN:", token);
      }
    });

    onMessageListener((payload) => {
      // console.log("Message received:", payload);
      const audio = new Audio("/notification.mp3");
      audio.volume = 1;
      audio.play().catch(() => { });
      toast.success(
        <div className="d-flex align-items-center">
          <IconGavel size={19} />
          <span className="text-secondary mx-1">{payload?.notification?.title || t.auctions.new_auction}</span>
        </div>
      );
    });
  }, []);

  return (
    <>
      <Navbar />
      <PageTop />
      <Suspense fallback={<div className="text-center py-5">{t.common.loading}</div>}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={pageTransition.initial}
            animate={pageTransition.animate}
            exit={pageTransition.exit}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/terms-conditions" element={<Navigate to="/terms" replace />} />
              <Route path="/faqs" element={<FaqsPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/login" element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              } />
              <Route path="/register" element={
                <AuthRoute>
                  <RegisterPage />
                </AuthRoute>
              } />
              <Route path="/verify-otp" element={
                <AuthRoute>
                  <VerifyOtpPage />
                </AuthRoute>
              } />
              <Route path="/forgot-password" element={
                <AuthRoute>
                  <ForgotPasswordPage />
                </AuthRoute>
              } />
              <Route path="/forgot/verify-otp" element={
                <AuthRoute>
                  <VerifyPasswordOtpPage />
                </AuthRoute>
              } />
              <Route path="/forgot/reset-password" element={
                <AuthRoute>
                  <ResetPasswordPage />
                </AuthRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/create-ad" element={
                <ProtectedRoute allowedRoles={["seller"]}>
                  <CreateAd />
                </ProtectedRoute>
              } />
              <Route path="/auction-details/:id" element={<AuctionDetails />} />
              <Route path="/all-auctions" element={<AllAuctions />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Suspense>
      <SocialIcons />
      <ScrollToTopButton />
      <Footer />
      <ToastContainer autoClose={2000} />
    </>
  );
}

export default App;
