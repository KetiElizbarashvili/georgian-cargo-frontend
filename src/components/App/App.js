import React from "react";
import { Switch, Route, Router } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from "context";
import { history } from "components/History";
import { ClientRoutes, AdminRoutes } from "routes";
import ScrollToTop from "utils/ScrollToTop";
import AdminDashboard from "components/Pages/AdminDashboard";
import CookieConsent from "react-cookie-consent";
import "./App.css";

function App() {
  return (
    <>
      <AuthContextProvider>
        <ToastContainer />
        <BrowserRouter>
          <Router history={history}>
            <ScrollToTop />
            <Switch>
              <Route path="/manage" component={AdminRoutes} />
              <Route path="/" component={ClientRoutes} />
            </Switch>
          </Router>
        </BrowserRouter>
      </AuthContextProvider>
      <CookieConsent
        expires={31}
        disableStyles={true}
        contentClasses={"d-inline-block pe-4 lh-base"}
        buttonWrapperClasses={"d-inline-block"}
        buttonClasses={"btn btn-primary btn-sm"}
        containerClasses="p-2 w-100 text-end position-fixed mb-0 alert alert-warning rounded-0 col-lg-12"
      // buttonStyle={{ background: "#f5a11c", color: "#4e503b", fontSize: "13px" }}
      >This website uses cookies to enhance the user experience.</CookieConsent>
    </>
  );
}

export default App;
