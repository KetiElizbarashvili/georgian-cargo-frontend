import { HomePage, LoginModal, NotFoundPage, RegisterModal } from "components/Pages";
import { ClientNavbar } from "components/Navbar";
import React, { useEffect, lazy, Suspense } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { ClientFooter } from "../components/Footer";
import { AuthContext } from "context";
import { useContext } from "react";
import { useCookies } from "react-cookie";
import { ClientProtectedRoute } from "components/ClientProtectedRoute.js";

// Lazy-loaded route chunks — only downloaded when the user navigates to them
const PrivateCargoTable   = lazy(() => import("components/PrivateCargoTable").then(m => ({ default: m.PrivateCargoTable })));
const PrivateCargoCart    = lazy(() => import("components/PrivateCargoCart/PrivateCargoCart"));
const ClientPersonalInfo  = lazy(() => import("components/ClientPersonalInfo/ClientPersonalInfo"));
const RegistrationSucess  = lazy(() => import("../components/Pages/RegistrationSucess.js"));
const ResetPasswordModal  = lazy(() => import("components/Pages/ResetPasswordModal"));
const ForgotPasswordForm  = lazy(() => import("components/ForgotPasswordForm/ForgotPasswordForm"));
const ClientPayments      = lazy(() => import("components/PrivateCustomerPayments/PrivateCustomerPayments"));
const ClientAddress       = lazy(() => import("components/ClientAddress/ClientAddress"));
const ContactUs           = lazy(() => import("components/ContactUs/ContactUs"));
const About               = lazy(() => import("components/About/About"));
const BookCourier         = lazy(() => import("components/BookCourier/BookCourier"));
const ClientBookings      = lazy(() => import("components/ClientBookings/ClientBookings"));
const VerifyCustomer      = lazy(() => import("components/VerifyCustomer/VerifyCustomer"));
const PrivacyPolicy       = lazy(() => import("components/PrivacyPolicy/PrivacyPolicy"));
const ClientNotifications = lazy(() => import("components/ClientNotifications"));
const ClientCoupons       = lazy(() => import("components/ClientCoupons"));
const Loyalty             = lazy(() => import("components/Loyalty"));

const ClientRoutes = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(['parcelsCart']);
  const location = useLocation();

  const clearCookiesAfterCartPay = () => {
  };
  useEffect(() => {
    if (location.pathname === '/payment-success') {
      removeCookie('parcelsCart', { path: '/' });
    }
  }, []);

  return (
    <>
      <ClientNavbar />

      <Route path="(.+)/login" component={LoginModal} />
      <Route path="(.+)/register" component={RegisterModal} />

      <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>}>
      <Switch>
        {/* <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} /> */}
        <Route path="/contact-us" component={ContactUs} />
        <Route path="/about" component={About} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/forgot-password" component={ForgotPasswordForm} />
        <Route path="/dashboard/cargos" children={<ClientProtectedRoute component={PrivateCargoTable} />} />
        <Route path="/dashboard/cart" children={<ClientProtectedRoute component={PrivateCargoCart} />} />
        <Route path="/dashboard/personal-info" children={<ClientProtectedRoute component={ClientPersonalInfo} />} />
        <Route path="/dashboard/coupons" children={<ClientProtectedRoute component={ClientCoupons} />} />
        <Route path="/dashboard/notifications" children={<ClientProtectedRoute component={ClientNotifications} />} />
        <Route path="/dashboard/payments" children={<ClientProtectedRoute component={ClientPayments} />} />
        <Route path="/dashboard/address" children={<ClientProtectedRoute component={ClientAddress} />} />
        <Route path="/dashboard/loyalty" children={<ClientProtectedRoute component={Loyalty} />} />
        <Route path="/book-a-courier/:sourcecountry/:destinationCountry" component={BookCourier} />
        <Route path="/dashboard/bookings" children={<ClientProtectedRoute component={ClientBookings} />} />
        <Route path="/verify/customer/:token" component={VerifyCustomer} />
        {/* <Route path="(.+)/index.html" component={ForgotPasswordForm} /> */}
        {/* <Route exact path="(.+)/index.html">
          <Redirect to="/reports/index.html" />
        </Route> */}

        {/* <Route path="/auth/customer/verification/:token">
          <Redirect replace to="/registration-sucess/" />
        </Route> */}
        {/* <Route
          //path="/home?emailVerified=true"
          path="/auth/customer/verification/:token"
          component={RegistrationSucess}
        /> */}

        <Route
          //path="/home?emailVerified=true"
          path="/registration-success"
          component={RegistrationSucess}
        />

        {/* <Route exact path="/reset-password/:token">
          <Redirect to="/reset-password" />
        </Route> */}
        <Route
          //path="/home?emailVerified=true"
          path="/reset-password/:token"
          component={ResetPasswordModal}
        />
        <Route path="/home/:tracking" component={HomePage} />
        <Route path="/home" component={HomePage} />

        <Route
          path="/payment-success"
          render={() => {
            return (
              <>
                <h1 style={{ textAlign: "center", margin: "20px" }}>
                  Payment successful!
                </h1>
                <h4 style={{ textAlign: "center" }}>
                  Please check your email for confirmation
                </h4>
                <ClientFooter />
              </>
            );
          }}
        />
        <Route
          path="/payment-error"
          render={() => {
            return (
              <>
                <h1 style={{ textAlign: "center", margin: "20px" }}>
                  Payment cancelled!
                </h1>
                <h2 style={{ textAlign: "center" }}>
                  If you think this is an error, please contact system
                  administrator
                </h2>
                <ClientFooter />
              </>
            );
          }}
        />
        <Route path="/404" status={404} component={NotFoundPage} />
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route>
          <Redirect replace to="/" />
        </Route>
      </Switch>
      </Suspense>
    </>
  );
};

export default ClientRoutes;
