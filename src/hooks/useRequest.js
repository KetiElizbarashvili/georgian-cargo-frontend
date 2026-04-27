import { useContext, useState, Fragment } from "react";
import useAxios from "hooks/useAxios";
import { AuthContext } from "context";

export default function useRequest(request, load = false, errorsDivName = "form-errors") {
  const axios = useAxios();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const errorsDiv = document.getElementById(errorsDivName);
  const send = async (data) => {
    setIsProcessing(true);
    if (load)
      document.getElementById("loader").classList.add("loading-indicator");
    try {
      const response = request(axios, data);
      return response;

    } catch (error) {
      if (error.response) {
        // Request made and server responded
        // console.log(error.response);
        if (errorsDiv !== null) {
          errorsDiv.classList.remove("d-none");
          errorsDiv.innerHTML = error.response.data.data.errors.join('\r\n');
        }

      } else if (error.request) {
        // The request was made but no response was received
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
      }
    }
    finally {
      setIsProcessing(false);
      if (load)
        document
          .getElementById("loader")
          .classList.remove("loading-indicator");
    }
  };
  return [send, isProcessing];
}
