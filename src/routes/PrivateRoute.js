import React, {useContext} from "react";
import {Route, Redirect} from "react-router-dom";
import { AuthContext } from "context";

const PrivateRoute = ({component, admin, ...rest}) => {
    const {auth} = useContext(AuthContext);
    if (admin) {
        if (auth.isLoggedIn && auth.accountType === "ADMIN") {
            return <Route {...rest} component={component} />;
        } else {
            return <Redirect to="/manage/login" />;
        }
    } else {
        if (auth.isLoggedIn) {
            return <Route {...rest} component={component} />;
        } else {
            return <Redirect to="/manage/login" />;
        }
    }
    // return <Route {...rest} component={component} />;
};

export default PrivateRoute;
