import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../context";
import clientRequest from "requests/client";
import { useRequest } from "hooks";

export const ClientProtectedRoute = ({ component }) => {
  const [getCustomer] = useRequest(clientRequest);
  const Component = component;
  const { auth } = useContext(AuthContext);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    getCustomer()
      .then((data) => {
        setCustomer(data.data.customer);
      })
  }, []);

  if (auth.isLoggedIn === false) {
    return <Redirect to="/home/login" />;
  }
  return <Component user={customer} />;

};