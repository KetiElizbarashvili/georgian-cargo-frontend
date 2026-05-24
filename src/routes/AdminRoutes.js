import React, { useContext, lazy, Suspense } from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import {NotFoundPage} from "components/Pages";
import {AuthContext} from "../context";

const AdminLogin     = lazy(() => import("../components/Pages/AdminLogin"));
const AdminLogout    = lazy(() => import("../components/Pages/AdminLogout"));
const AdminDashboard = lazy(() => import("../components/Pages/AdminDashboard"));

const AdminRoutes = () => {
  const {auth} = useContext(AuthContext);
    return (
      <Suspense fallback={<div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>}>
      <Switch>
        {!auth.isLoggedIn ? (
          <Route path="/manage/login" component={AdminLogin} />
        ) : (
          <Redirect from="/manage/login" to="/manage" />
        )}

        <Route path="/manage/logout" component={AdminLogout} />
        <Route path="/not-found" status={404} component={NotFoundPage} />

        {!auth.isLoggedIn ? (
          <Redirect replace to="/manage/login" />
        ) : (
          <PrivateRoute admin path="/manage" component={AdminDashboard} />
        )}

        <Redirect replace to="/not-found" />
      </Switch>
      </Suspense>
    );
};
export default AdminRoutes;
