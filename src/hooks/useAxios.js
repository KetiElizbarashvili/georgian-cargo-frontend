import { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { AuthContext } from "context";

export default function useAxios() {
  const { auth } = useContext(AuthContext);
  const { accessToken } = { ...auth };

  // const baseURL = "https://api.georgiancargo.co.uk";
  // http://stg.georgiancargo.co.uk/home
  // http://stg.api.georgiancargo.co.uk/home
  // const baseURL = "https://api.georgiancargo.co.uk";
  // const baseURL = "http://localhost";
  const baseURL = process.env.REACT_APP_API;

  const defaultAxios = Axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const [axios, setAxios] = useState({ instance: defaultAxios });
  useEffect(() => {
    setAxios({
      instance: Axios.create({
        baseURL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    });
    // eslint-disable-next-line
  }, [accessToken]);

  return axios.instance;
}
