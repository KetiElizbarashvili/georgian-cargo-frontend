import {useState} from "react";
import {useCookies} from "react-cookie";
import moment from "moment";

const defaultAuthData = ['accessToken', 'refreshToken', 'isLoggedIn', 'accountType', 'routes', 'accountId'];
const useAuthentication = (defaultAuth) => {
    const [auth, setAuth] = useState(defaultAuth);
    const [, setCookie, removeCookie] = useCookies([
        "accessToken",
        "refreshToken",
        "isLoggedIn",
        "accountType",
    ]);
    const persistent_cookies = ["refreshToken"];

    const setAuthCookies = (data) => {
        let config = {
            path: "/",
        };
        if(data && Object.keys(data).length === 0){
            for (const key in defaultAuthData) {
                removeCookie(defaultAuthData[key], config);
            }
        }else{
            for (const key in data) {
                if (persistent_cookies.includes(key)) {
                    config.expires = moment().add(30, "days").toDate();
                }
                setCookie(key, data[key], config);
            }
        }
        setAuth(data);
    };
    return {auth, setAuth: setAuthCookies};
};

export default useAuthentication;
