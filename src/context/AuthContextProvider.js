import React, { useEffect } from "react";
import AuthContext from "./AuthContext";
import { useAuthentication } from "hooks";
import { useCookies } from "react-cookie";
import moment from "moment";

const AuthContextProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies([
    "accessToken",
    "refreshToken",
    "isLoggedIn",
    "accountType",
    "routes",
    "accountId",
  ]);

  const defaultAuthState = {
    accessToken: cookies.accessToken || null,
    refreshToken: cookies.refreshToken || null,
    isLoggedIn: cookies.isLoggedIn === "true" || false,
    accountType: cookies.accountType || false,
    routes: cookies.routes || [],
    accountId: cookies.accountId || null,
    staff: cookies.staff || null,
    sourceCountry: cookies.sourceCountry || null,
  };
  const authObj = useAuthentication(defaultAuthState);
  const { auth } = authObj;

  useEffect(() => {
    const persistent_cookies = ["refreshToken"];
    for (const key in auth) {
      let config = {
        path: "/",
      };
      if (persistent_cookies.includes(key)) {
        config.expires = moment().add(30, "days").toDate();
      }
      setCookie(key, auth[key], config);
    }
    // console.log(cookies, "<---cookies");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);
  return (
    <AuthContext.Provider value={authObj}>{children}</AuthContext.Provider>
  );
};

export default AuthContextProvider;
