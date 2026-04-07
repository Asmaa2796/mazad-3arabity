import { useRef, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLanguage } from "../../../shared/i18n/LanguageProvider";
import { fetchProfile } from "../../../Redux/Slices/authSlice";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();
  const { t } = useLanguage();
  const hasShownToastRef = useRef(false);

  useEffect(() => {
    if (token && !user && location.pathname === '/create-ad') {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch, location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/create-ad") {
      hasShownToastRef.current = false;
    }
  }, [location.pathname]);


  let redirectTo = null;

  if (location.pathname === "/create-ad") {
    if (!token) {
      redirectTo = "/login";
      if (!hasShownToastRef.current) {
        toast.info(t.nav.please_login);
        hasShownToastRef.current = true;
      }
    } else if (!user || !allowedRoles.includes(user?.role)) {
      redirectTo = "/";
      if (!hasShownToastRef.current) {
        toast.warning(t.nav.you_cant_create_ad);
        hasShownToastRef.current = true;
      }
    }
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;

};

export default ProtectedRoute;
