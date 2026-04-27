import React, {useContext} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import {NotFoundPage} from "components/Pages";
import AdminLogin from "../components/Pages/AdminLogin";
import AdminLogout from "../components/Pages/AdminLogout";
import AdminDashboard from "../components/Pages/AdminDashboard";
import {AuthContext} from "../context";

const AdminRoutes = () => {
  const {auth} = useContext(AuthContext);
    return (
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
    );
};
export default AdminRoutes;
