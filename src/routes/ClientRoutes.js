import {
  HomePage,
  LoginModal,
  NotFoundPage,
  RegisterModal,
} from "components/Pages";
import { ClientNavbar } from "components/Navbar";
import React, { useEffect } from "react";
import { Redirect, Route, Switch, useLocation, Outlet } from "react-router-dom";
import { ClientFooter } from "../components/Footer";
import { AuthContext } from "context";
import { useContext } from "react";
import { PrivateCargoTable } from "components/PrivateCargoTable";
import PrivateCargoCart from "components/PrivateCargoCart/PrivateCargoCart";
import ClientPersonalInfo from "components/ClientPersonalInfo/ClientPersonalInfo";
import RegistrationSucess from "../components/Pages/RegistrationSucess.js";
import ResetPasswordModal from "components/Pages/ResetPasswordModal";
import ForgotPasswordForm from "components/ForgotPasswordForm/ForgotPasswordForm";
import ClientPayments from "components/PrivateCustomerPayments/PrivateCustomerPayments";
import ClientAddress from "components/ClientAddress/ClientAddress";
import ContactUs from "components/ContactUs/ContactUs";
import About from "components/About/About";
import { useCookies } from "react-cookie";
import BookCourier from "components/BookCourier/BookCourier";
import ClientBookings from "components/ClientBookings/ClientBookings";
import { ClientProtectedRoute } from "components/ClientProtectedRoute.js";
import VerifyCustomer from "components/VerifyCustomer/VerifyCustomer";
import PrivacyPolicy from "components/PrivacyPolicy/PrivacyPolicy";
import LoginPage from "components/LoginPage";
import RegisterPage from "components/RegisterPage";
import ClientNotifications from "components/ClientNotifications";
import ClientCoupons from "components/ClientCoupons";
import Loyalty from "components/Loyalty";

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
    </>
  );
};

export default ClientRoutes;
