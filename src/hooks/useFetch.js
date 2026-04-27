import { useState } from "react";
import axios from "axios";

// axios.defaults.baseURL = "https://jsonplaceholder.typicode.com/";
// axios.defaults.baseURL = "http://localhost";
// axios.defaults.baseURL = "https://api.georgiancargo.co.uk";
const baseURL = process.env.REACT_APP_API;

export const useFetch = () => {
  const [response, setResponse] = useState(undefined);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async (params) => {
    try {
      const result = await axios.request(params);
      setResponse(result.data);
      console.log(result);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { response, error, loading, fetchData };
};

export default useFetch;
